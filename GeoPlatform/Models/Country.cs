using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoPlatform.Models
{
    public class Country
    {
        public int Id { get; set; }

        public string NameEN { get; set; }

        public string NamePL { get; set; }

        public string Name
        {
            get
            {
                string language = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
                switch (language)
                {
                    case "en":
                        return NameEN;
                    case "pl":
                        return NamePL;
                    default:
                        return NameEN;
                }
            }
        }

        public string Code { get; set; }
    }
}
