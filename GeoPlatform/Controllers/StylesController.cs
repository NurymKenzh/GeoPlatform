using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeoPlatform.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GeoPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StylesController : ControllerBase
    {
        private readonly GeoServerController _GeoServer;

        public StylesController(GeoServerController GeoServer)
        {
            _GeoServer = GeoServer;
        }

        // GET: api/Styles
        [Authorize(Roles = "Administrator, Moderator")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Style>>> GetStyle()
        {
            return _GeoServer.GetWorkspaceStyles();
        }

        // GET: api/Styles/StyleName
        [HttpGet("{name}")]
        public async Task<ActionResult<Style>> GetCountry(string name)
        {
            return _GeoServer.GetStyle(name);
        }

        // POST: api/Styles
        [Authorize(Roles = "Administrator, Moderator")]
        [HttpPost]
        [RequestSizeLimit(100_000_000)]
        [DisableRequestSizeLimit]
        public void PostStyle()
        {
            _GeoServer.CreateStyle(HttpContext.Request.Form.Files);
        }

        // PUT: api/Styles/StyleName
        [Authorize(Roles = "Administrator, Moderator")]
        [HttpPut("{name}")]
        public async Task<IActionResult> PutStyle(string name)
        {
            _GeoServer.EditStyle(name, HttpContext.Request.Form.Files.FirstOrDefault());

            return NoContent();
        }

        // DELETE: api/Styles/StyleName
        [Authorize(Roles = "Administrator, Moderator")]
        [HttpDelete("{name}")]
        public void DeleteStyle(string name)
        {
            _GeoServer.DeleteStyle(name);
        }
    }
}
