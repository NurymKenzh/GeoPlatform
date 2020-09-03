using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using GeoPlatform.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace GeoPlatform.Controllers
{
    public class GeoServerController : Controller
    {
        private string curl,
            user,
            password,
            URL,
            Workspace;

        public GeoServerController()
        {
            curl = Startup.Configuration["curl"];
            user = Startup.Configuration["GeoServer:User"];
            password = Startup.Configuration["GeoServer:Password"];
            URL = Startup.Configuration["GeoServer:URL"];
            Workspace = Startup.Configuration["GeoServer:Workspace"];
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
            process.WaitForExit();
            return output;
        }

        //public string[] GetWorkspaceDatastoreNames()
        //{
        //    string arguments = $" -u" +
        //        $" {user}:{password}" +
        //        $" -XGET" +
        //        $" {URL}rest/workspaces/{Workspace}/datastores.json";
        //    string output = CURL(arguments);
        //    dynamic json = JsonConvert.DeserializeObject(output);
        //    List<string> datastores = new List<string>();
        //    foreach(var datastore in json.dataStores.dataStore)
        //    {
        //        datastores.Add(datastore.name.ToString());
        //    }
        //    return datastores.ToArray();
        //}

        //public string[] GetWorkspaceCoveragestoreNames()
        //{
        //    string arguments = $" -u" +
        //        $" {user}:{password}" +
        //        $" -XGET" +
        //        $" {URL}rest/workspaces/{Workspace}/coveragestores.json";
        //    string output = CURL(arguments);
        //    dynamic json = JsonConvert.DeserializeObject(output);
        //    List<string> coveragestores = new List<string>();
        //    foreach(var datastore in json.dataStores.dataStore)
        //    {
        //        coveragestores.Add(datastore.name.ToString());
        //    }
        //    return coveragestores.ToArray();
        //}

        private string[] GetWorkspaceLayerNames()
        {
            string arguments = $" -u" +
                $" {user}:{password}" +
                $" -XGET" +
                $" {URL}rest/layers.json";
            string output = CURL(arguments);
            dynamic json = JsonConvert.DeserializeObject(output);
            List<string> layers = new List<string>();
            foreach(var layer in json.layers.layer)
            {
                if(layer.name.ToString().Split(':')[0] == Workspace)
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
    }
}
