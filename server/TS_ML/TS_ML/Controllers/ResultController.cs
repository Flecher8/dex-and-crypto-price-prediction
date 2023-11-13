using Microsoft.AspNetCore.Mvc;

namespace TS_ML.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResultController : ControllerBase
    {

        [HttpGet("min_value")]
        public async Task<IActionResult> Get_Min(int days)
        {
            TS ts = new TS();
            return Ok(ts.GetMin(days));
        }
        [HttpGet("max_value")]
        public async Task<IActionResult> Get_Max(int days)
        {
            TS ts = new TS();
            return Ok(ts.GetMax(days));
        }

        [HttpGet("max_value_history")]
        public async Task<IActionResult> Get_Max_History()
        {
            TS ts = new TS();
            return Ok(ts.GetMaxHistory());
        }
        [HttpGet("min_value_history")]
        public async Task<IActionResult> Get_Min_History()
        {
            TS ts = new TS();
            return Ok(ts.GetMinHistory());
        }
    }
}