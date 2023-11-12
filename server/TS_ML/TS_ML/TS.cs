using Microsoft.ML;

namespace TS_ML
{
    public class TS
    {
        public float[] GetMax(int day)
        {
            var mlContext = new MLContext();

            var dataPath = "E:\\4th_course\\Blockchain\\API_ML\\API_ML\\BTC-USD.csv";

            var bitcoinData = new List<InputData>();

            using (var reader = new StreamReader(dataPath))
            {
                reader.ReadLine();

                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var values = line.Split(';');

                    var date = DateTime.Parse(values[0]);
                    var low = float.Parse(values[1].Replace('.', ','));
                    var high = float.Parse(values[2].Replace('.', ','));

                    bitcoinData.Add(new InputData { Date = date, Low = low, High = high });
                }
            }

            var dataView = mlContext.Data.LoadFromEnumerable(bitcoinData);

            var estimator = mlContext.Forecasting.ForecastBySsa(
                outputColumnName: "ForecastedHigh",
                inputColumnName: "High",
                windowSize: 7, seriesLength: bitcoinData.Count, trainSize: bitcoinData.Count, horizon: day);

            var model = estimator.Fit(dataView);

            var forecastEngine = model.CreateTimeSeriesEngine<InputData, ResultHigh>(mlContext);
            var forecastOutput = forecastEngine.Predict();

            return forecastOutput.ForecastedHigh;
        }
        public float[] GetMin(int day)
        {
            var mlContext = new MLContext();

            var dataPath = "E:\\4th_course\\Blockchain\\API_ML\\API_ML\\BTC-USD.csv";

            var bitcoinData = new List<InputData>();

            using (var reader = new StreamReader(dataPath))
            {
                reader.ReadLine();

                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var values = line.Split(';');

                    var date = DateTime.Parse(values[0]);
                    var low = float.Parse(values[1].Replace('.', ','));
                    var high = float.Parse(values[2].Replace('.', ','));

                    bitcoinData.Add(new InputData { Date = date, Low = low, High = high });
                }
            }

            var dataView = mlContext.Data.LoadFromEnumerable(bitcoinData);

            var estimator = mlContext.Forecasting.ForecastBySsa(
                outputColumnName: "ForecastedLow",
                inputColumnName: "Low",
                windowSize: 7, seriesLength: bitcoinData.Count, trainSize: bitcoinData.Count, horizon: day);

            var model = estimator.Fit(dataView);

            var forecastEngine = model.CreateTimeSeriesEngine<InputData, ResultLow>(mlContext);
            var forecastOutput = forecastEngine.Predict();

            return forecastOutput.ForecastedLow;
        }
    }
}
