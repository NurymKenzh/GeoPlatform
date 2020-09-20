﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using GeoPlatform.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GeoPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LayersController : ControllerBase
    {
        private readonly GeoServerController _GeoServer;

        public LayersController(GeoServerController GeoServer)
        {
            _GeoServer = GeoServer;
        }

        // GET: api/Layers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Layer>>> GetLayer()
        {
            return _GeoServer.GetWorkspaceLayers();
        }

        // GET: api/Layers/LayerName
        [HttpGet("{name}")]
        public async Task<ActionResult<Layer>> GetLayer(string Name)
        {
            var layer = new Layer()
            {
                Name = Name
            };

            return layer;
        }

        // POST: api/Layers
        [Authorize(Roles = "Administrator, Moderator")]
        [HttpPost]
        [RequestSizeLimit(100_000_000)]
        [DisableRequestSizeLimit]
        public void PostLayer()
        {
            _GeoServer.Publish(HttpContext.Request.Form.FirstOrDefault(f => f.Key == "DefaultStyle").Value.ToString(),
                HttpContext.Request.Form.Files);
        }

        // DELETE: api/Layers/LayerName
        [Authorize(Roles = "Administrator, Moderator")]
        [HttpDelete("{name}")]
        public void DeleteLayer(string name)
        {
            _GeoServer.Unpublish(name);
        }
    }
}
