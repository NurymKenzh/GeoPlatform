using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeoPlatform.Models;
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
    }
}
