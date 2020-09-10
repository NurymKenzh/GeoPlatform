﻿using System;
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
    }
}