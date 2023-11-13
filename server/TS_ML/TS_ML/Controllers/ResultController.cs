using Microsoft.AspNetCore.Mvc;

namespace TS_ML.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResultController : ControllerBase
    {

        [HttpGet("Min value")]
        public async Task<IActionResult> Get_Min(int days)
        {
            TS ts = new TS();
            return Ok(ts.GetMin(days));
        }
        [HttpGet("Max value")]
        public async Task<IActionResult> Get_Max(int days)
        {
            TS ts = new TS();
            return Ok(ts.GetMax(days));
        }

        [HttpGet("Max value history")]
        public async Task<IActionResult> Get_Max_History()
        {
            TS ts = new TS();
            return Ok(ts.GetMaxHistory());
        }
        [HttpGet("Min value history")]
        public async Task<IActionResult> Get_Min_History()
        {
            TS ts = new TS();
            return Ok(ts.GetMinHistory());
        }
    }
}