using Microsoft.ML;
using Microsoft.ML.Transforms.TimeSeries;
using System.Formats.Asn1;
using System.Globalization;
using System.Linq;

namespace TS_ML
{
    public class TS
    {
        public MaxPrediction[] GetMax(int day)
        {
            var mlContext = new MLContext();

            var dataPath = Path.Combine(Directory.GetCurrentDirectory(), "BTC-USD.csv");

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

            var result = new List<MaxPrediction>();

            for (int i = 0; i < forecastOutput.ForecastedHigh.Length; i++)
            {
                result.Add(new MaxPrediction
                {
                    Date = DateTime.Today.AddDays(i+1),
                    High = forecastOutput.ForecastedHigh[i]
                });
            }

            return result.ToArray();
        }
        public MinPrediction[] GetMin(int day)
        {
            var mlContext = new MLContext();

            var dataPath = Path.Combine(Directory.GetCurrentDirectory(), "BTC-USD.csv");

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

            var result = new List<MinPrediction>();

            for (int i = 0; i < forecastOutput.ForecastedLow.Length; i++)
            {
                result.Add(new MinPrediction
                {
                    Date = DateTime.Today.AddDays(i + 1),
                    Low = forecastOutput.ForecastedLow[i]
                });
            }

            return result.ToArray();
        }

        public MaxPrediction[] GetMaxHistory()
        {
            var mlContext = new MLContext();

            var dataPath = Path.Combine(Directory.GetCurrentDirectory(), "BTC-USD.csv");

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

            var result = bitcoinData.Select(data => new MaxPrediction
            {
                Date = data.Date,
                High = data.High
            }).ToArray();

            return result;
        }

        public MinPrediction[] GetMinHistory()
        {
            var mlContext = new MLContext();

            var dataPath = Path.Combine(Directory.GetCurrentDirectory(), "BTC-USD.csv");

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

            var result = bitcoinData.Select(data => new MinPrediction
            {
                Date = data.Date,
                Low = data.Low
            }).ToArray();

            return result;
        }
    }
}
