using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GeoPlatform.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace GeoPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeoServerController : ControllerBase
    {
        private string curl,
            user,
            password,
            URL,
            DataDir,
            Workspace,
            BuferDir;

        public GeoServerController()
        {
            curl = Startup.Configuration["curl"];
            user = Startup.Configuration["GeoServer:User"];
            password = Startup.Configuration["GeoServer:Password"];
            URL = Startup.Configuration["GeoServer:URL"];
            DataDir = Startup.Configuration["GeoServer:DataDir"];
            Workspace = Startup.Configuration["GeoServer:Workspace"];
            BuferDir = Startup.Configuration["BuferDir"];
        }

        // GET: api/GeoServer/GetURL
        [HttpGet("GetURL")]
        public async Task<ActionResult<string>> GetURL()
        {
            return Ok(URL);
        }

        // GET: api/GeoServer/GetWorkspace
        [HttpGet("GetWorkspace")]
        public async Task<ActionResult<string>> GetWorkspace()
        {
            return Ok(Workspace);
        }

        private string CURL(string Arguments)
        {
            Process process = new Process();
            try
            {
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.FileName = curl;
                process.StartInfo.Arguments = Arguments;
                process.Start();
            }
            catch (Exception exception)
            {
                throw new Exception(exception.ToString(), exception.InnerException);
            }
            string output = process.StandardOutput.ReadToEnd();
            string error = process.StandardError.ReadToEnd();
            process.WaitForExit();
            return output;
        }

        private string[] GetWorkspaceDatastoreNames()
        {
            string arguments = $" -u" +
                $" {user}:{password}" +
                $" -XGET" +
                $" {URL}rest/workspaces/{Workspace}/datastores.json";
            string output = CURL(arguments);
            dynamic json = JsonConvert.DeserializeObject(output);
            List<string> datastores = new List<string>();
            foreach (var datastore in json.dataStores.dataStore)
            {
                datastores.Add(datastore.name.ToString());
            }
            return datastores.ToArray();
        }

        private string[] GetWorkspaceCoveragestoreNames()
        {
            string arguments = $" -u" +
                $" {user}:{password}" +
                $" -XGET" +
                $" {URL}rest/workspaces/{Workspace}/coveragestores.json";
            string output = CURL(arguments);
            dynamic json = JsonConvert.DeserializeObject(output);
            List<string> coveragestores = new List<string>();
            foreach (var coveragestore in json.coverageStores.coverageStore)
            {
                coveragestores.Add(coveragestore.name.ToString());
            }
            return coveragestores.ToArray();
        }

        private string[] GetWorkspaceLayerNames()
        {
            string arguments = $" -u" +
                $" {user}:{password}" +
                $" -XGET" +
                $" {URL}rest/layers.json";
            string output = CURL(arguments);
            dynamic json = JsonConvert.DeserializeObject(output);
            List<string> layers = new List<string>();
            foreach (var layer in json.layers.layer)
            {
                if (layer.name.ToString().Split(':')[0] == Workspace)
                {
                    layers.Add(layer.name.ToString().Split(':')[1]);
                }
            }
            return layers.ToArray();
        }

        public Layer[] GetWorkspaceLayers()
        {
            return GetWorkspaceLayerNames().Select(l => new Layer() { Name = l }).ToArray();
        }

        [RequestSizeLimit(100_000_000)]
        [DisableRequestSizeLimit]
        public Layer[] Publish(string DefaultStyle, IFormFileCollection FormFiles)
        {
            foreach(var formFile in FormFiles)
            {
                var filePath = Path.Combine(DataDir, formFile.FileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    formFile.CopyTo(fileStream);
                }
            }
            foreach (var formFile in FormFiles)
            {
                if (Path.GetExtension(formFile.FileName) == ".tif")
                {
                    PublishTif(formFile.FileName, DefaultStyle);
                }
                if (Path.GetExtension(formFile.FileName) == ".shp")
                {
                    PublishShp(formFile.FileName, DefaultStyle);
                }
                //RemoveNoLayerFile(formFile.FileName);
            }

            Layer[] layers = { new Layer() { Name = "TEST" } };

            return layers;
        }

        private void PublishTif(string File, string DefaultStyle)
        {
            string argumentsStore = $" -v -u" +
                $" {user}:{password}" +
                $" -POST" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<coverageStore><name>{Path.GetFileNameWithoutExtension(File)}</name>" +
                $"<workspace>{Workspace}</workspace>" +
                $"<enabled>true</enabled>" +
                $"<type>GeoTIFF</type>" +
                $"<url>/data/{Workspace}/{File}</url></coverageStore>\"" +
                $" {URL}rest/workspaces/{Workspace}/coveragestores?configure=all",
            argumentsLayer = $" -v -u" +
                $" {user}:{password}" +
                $" -PUT" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<coverage><name>{Path.GetFileNameWithoutExtension(File)}</name>" +
                $"<title>{Path.GetFileNameWithoutExtension(File)}</title>" +
                $"<defaultInterpolationMethod><name>nearest neighbor</name></defaultInterpolationMethod></coverage>\"" +
                $" \"{URL}rest/workspaces/{Workspace}/coveragestores/{Path.GetFileNameWithoutExtension(File)}/coverages?recalculate=nativebbox\"",
            argumentsStyle = $" -v -u" +
                $" {user}:{password}" +
                $" -XPUT" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<layer><defaultStyle><name>{Workspace}:{DefaultStyle}</name></defaultStyle></layer>\"" +
                $" \"{URL}rest/workspaces/{Workspace}/layers/{Workspace}:{Path.GetFileNameWithoutExtension(File)}\"";
            CURL(argumentsStore);
            CURL(argumentsLayer);
            CURL(argumentsStyle);
        }

        private void PublishShp(string File, string DefaultStyle)
        {
            string argumentsStore = $" -v -u" +
                $" {user}:{password}" +
                $" -POST" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<dataStore><name>{Path.GetFileNameWithoutExtension(File)}</name>" +
                $"<workspace><name>{Workspace}</name></workspace>" +
                $"<enabled>true</enabled>" +
                $"<type>Shapefile</type>" +
                $"<connectionParameters><entry key='url'>file:data/{Workspace}/{File}</entry></connectionParameters></dataStore>\"" +
                $" \"{URL}rest/workspaces/{Workspace}/datastores\"",
            argumentsLayer = $" -v -u" +
                $" {user}:{password}" +
                $" -POST" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<featureType><name>{Path.GetFileNameWithoutExtension(File)}</name>" +
                $"<title>{Path.GetFileNameWithoutExtension(File)}</title></featureType>\"" +
                $" \"{URL}rest/workspaces/{Workspace}/datastores/{Path.GetFileNameWithoutExtension(File)}/featuretypes?recalculate=nativebbox\"",
            argumentsStyle = $" -v -u" +
                $" {user}:{password}" +
                $" -XPUT" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<layer><defaultStyle><name>{Workspace}:{DefaultStyle}</name></defaultStyle></layer>\"" +
                $" \"{URL}rest/layers/{Workspace}:{Path.GetFileNameWithoutExtension(File)}\"";
            CURL(argumentsStore);
            CURL(argumentsLayer);
            CURL(argumentsStyle);
        }

        public Layer GetLayer(string Name)
        {
            Layer layer = new Layer()
            {
                Name = Name
            };
            string argumentsLayer = $" -v -u" +
                $" {user}:{password}" +
                $" -XGET" +
                $" {URL}rest/layers/{Workspace}:{Name}";
            dynamic json = JsonConvert.DeserializeObject(CURL(argumentsLayer));
            layer.DefaultStyle = json.layer.defaultStyle.name;
            return layer;
        }

        public void Unpublish(string Layer)
        {
            if (GetWorkspaceCoveragestoreNames().Contains(Layer))
            {
                UnpublishTif(Layer);
            }
            else if(GetWorkspaceDatastoreNames().Contains(Layer))
            {
                UnpublishShp(Layer);
            }
            DeleteLayerFiles(Layer);
        }

        private void UnpublishTif(string Layer)
        {
            string argumentsCoveragestore = $" -v -u" +
                $" {user}:{password}" +
                $" -XDELETE" +
                $" {URL}rest/workspaces/{Workspace}/coveragestores/{Layer}?recurse=true";
            CURL(argumentsCoveragestore);
        }

        private void UnpublishShp(string Layer)
        {
            string argumentsDatastores = $" -v -u" +
                $" {user}:{password}" +
                $" -XDELETE" +
                $" {URL}rest/workspaces/{Workspace}/datastores/{Layer}?recurse=true";
            CURL(argumentsDatastores);
        }

        private void DeleteLayerFiles(string Layer)
        {
            foreach(string file in Directory.EnumerateFiles(DataDir, $"{Layer}.*"))
            {
                System.IO.File.Delete(file);
            }
        }

        public void EditLayer(string Layer, string DefaultStyle)
        {
            string argumentsStyle = $" -v -u" +
                $" {user}:{password}" +
                $" -XPUT" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<layer><defaultStyle><name>{Workspace}:{DefaultStyle}</name></defaultStyle></layer>\"" +
                $" \"{URL}rest/layers/{Workspace}:{Layer}\"";
            CURL(argumentsStyle);
        }

        private string[] GetWorkspaceStyleNames()
        {
            string arguments = $" -u" +
                $" {user}:{password}" +
                $" -XGET" +
                $" {URL}rest/workspaces/{Workspace}/styles.json";
            string output = CURL(arguments);
            dynamic json = JsonConvert.DeserializeObject(output);
            List<string> styles = new List<string>();
            try
            {
                foreach (var style in json.styles.style)
                {
                    styles.Add(style.name.ToString());
                }
            }
            catch { }
            return styles.ToArray();
        }

        public Style[] GetWorkspaceStyles()
        {
            return GetWorkspaceStyleNames().Select(l => new Style() { Name = l }).ToArray();
        }

        public Style GetStyle(string Name)
        {
            Style style = new Style()
            {
                Name = Name
            };
            string argumentsStyleCode = $" -v -u" +
                $" {user}:{password}" +
                $" -XGET" +
                $" {URL}rest/workspaces/{Workspace}/styles/{Name}.sld";
            style.Code = CURL(argumentsStyleCode);
            return style;
        }

        private void CreateStyle(string File)
        {
            string argumentsStyle = $" -v -u" +
                $" {user}:{password}" +
                $" -XPOST" +
                $" -H \"Content-type: text/xml\"" +
                $" -d \"<style><name>{Path.GetFileNameWithoutExtension(File)}</name>" +
                $"<filename>{Path.GetFileNameWithoutExtension(File)}.sld</filename></style>\"" +
                $" {URL}rest/workspaces/{Workspace}/styles",
            argumentsStyleFile = $" -v -u" +
                $" {user}:{password}" +
                $" -XPUT" +
                $" -H \"Content-type: application/vnd.ogc.sld+xml\"" +
                $" -d @\"{File}\"" +
                $" \"{URL}rest/workspaces/{Workspace}/styles/{Path.GetFileNameWithoutExtension(File)}\"";
            CURL(argumentsStyle);
            CURL(argumentsStyleFile);
        }

        [RequestSizeLimit(100_000_000)]
        [DisableRequestSizeLimit]
        public void CreateStyle(IFormFileCollection FormFiles)
        {
            foreach (var formFile in FormFiles)
            {
                if (!Directory.Exists(BuferDir))
                {
                    Directory.CreateDirectory(BuferDir);
                }
                var filePath = Path.Combine(BuferDir, formFile.FileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    formFile.CopyTo(fileStream);
                }
            }
            foreach (var formFile in FormFiles)
            {
                if (Path.GetExtension(formFile.FileName) == ".sld")
                {
                    CreateStyle(Path.Combine(BuferDir, formFile.FileName));
                }
                System.IO.File.Delete(Path.Combine(BuferDir, formFile.FileName));
            }
        }

        public void DeleteStyle(string Name)
        {
            string argumentsStyle = $" -v -u" +
                $" {user}:{password}" +
                $" -XDELETE" +
                $" {URL}rest/workspaces/{Workspace}/styles/{Name}";
            CURL(argumentsStyle);
        }

        private void EditStyle(string StyleName, string File)
        {
            string argumentsStyleFile = $" -v -u" +
                $" {user}:{password}" +
                $" -XPUT" +
                $" -H \"Content-type: application/vnd.ogc.sld+xml\"" +
                $" -d @\"{File}\"" +
                $" \"{URL}rest/workspaces/{Workspace}/styles/{StyleName}\"";
            CURL(argumentsStyleFile);
        }

        [RequestSizeLimit(100_000_000)]
        [DisableRequestSizeLimit]
        public void EditStyle(string StyleName, IFormFile FormFile)
        {
            if (!Directory.Exists(BuferDir))
            {
                Directory.CreateDirectory(BuferDir);
            }
            var filePath = Path.Combine(BuferDir, FormFile.FileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                FormFile.CopyTo(fileStream);
            }
            if (Path.GetExtension(FormFile.FileName) == ".sld")
            {
                EditStyle(StyleName, Path.Combine(BuferDir, FormFile.FileName));
            }
            System.IO.File.Delete(Path.Combine(BuferDir, FormFile.FileName));
        }
    }
}
