namespace TS_ML
{
    public class InputData
    {
        public DateTime Date { get; set; }
        public float High { get; set; }
        public float Low { get; set; }
    }

    public class MaxPrediction
    {
        public DateTime Date { get; set; }
        public float High { get; set; }
    }

    public class MinPrediction
    {
        public DateTime Date { get; set; }
        public float Low { get; set; }
    }
}