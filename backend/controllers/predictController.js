import { getPredictions } from '../services/mlService.js';
import { generateRecommendations } from '../services/recommendationService.js';

const getVal = (body, keys) => {
  for (const k of keys) {
    if (body[k] !== undefined) return body[k];
  }
  return undefined;
};

// @desc    Run prediction and recommendation pipeline
// @route   POST /api/predict
// @access  Private
export const predictClimate = async (req, res, next) => {
  try {
    const temp = getVal(req.body, ['Temperature', 'temperature', 'temp']);
    const aqi = getVal(req.body, ['AQI', 'aqi', 'airQuality']);
    const popDensity = getVal(req.body, ['Population Density', 'populationDensity', 'popDensity', 'population']);
    const energy = getVal(req.body, ['Energy Consumption', 'energyConsumption', 'energy']);
    const greenness = getVal(req.body, ['Urban Greenness Ratio', 'urbanGreennessRatio', 'greenness', 'greennessRatio']);
    const elevation = getVal(req.body, ['Elevation', 'elevation', 'elev']);
    const landCover = getVal(req.body, ['Land Cover', 'landCover', 'landcover']);

    if (
      temp === undefined ||
      aqi === undefined ||
      popDensity === undefined ||
      energy === undefined ||
      greenness === undefined ||
      elevation === undefined ||
      landCover === undefined
    ) {
      const error = new Error('Please provide all required parameters: Temperature, AQI, Population Density, Energy Consumption, Urban Greenness Ratio, Elevation, Land Cover');
      error.statusCode = 400;
      return next(error);
    }

    const validLandCovers = ['Water', 'Green Space', 'Industrial', 'Urban'];
    if (!validLandCovers.includes(landCover)) {
      const error = new Error(`Invalid Land Cover. Must be one of: ${validLandCovers.join(', ')}`);
      error.statusCode = 400;
      return next(error);
    }

    const latitude = getVal(req.body, ['Latitude', 'latitude', 'lat']) !== undefined 
      ? parseFloat(getVal(req.body, ['Latitude', 'latitude', 'lat']))
      : 0.0;
    const longitude = getVal(req.body, ['Longitude', 'longitude', 'lng', 'lon']) !== undefined
      ? parseFloat(getVal(req.body, ['Longitude', 'longitude', 'lng', 'lon']))
      : 0.0;

    const inputs = {
      latitude,
      longitude,
      elevation: parseFloat(elevation),
      temperature: parseFloat(temp),
      landCover,
      populationDensity: parseFloat(popDensity),
      energyConsumption: parseFloat(energy),
      aqi: parseFloat(aqi),
      urbanGreennessRatio: parseFloat(greenness)
    };

    const mlPredictions = await getPredictions(inputs);

    const recommendations = generateRecommendations(inputs, mlPredictions);

    res.status(200).json({
      success: true,
      inputs,
      predictions: {
        heatRiskScore: mlPredictions['Heat Risk Score'],
        heatVulnerabilityScore: mlPredictions['Heat Vulnerability Score'],
        plantationPriorityScore: mlPredictions['Plantation Priority Score']
      },
      recommendations: {
        riskCategory: recommendations.riskCategory,
        futureTemperature: recommendations.futureTemperature,
        plantationPriorityLevel: recommendations.plantationPriorityLevel,
        plantationRanking: recommendations.plantationRanking,
        greenCoverTarget: recommendations.greenCoverTarget,
        temperatureReductionEstimate: recommendations.temperatureReductionEstimate,
        climateRecommendations: recommendations.climateRecommendations
      }
    });

  } catch (error) {
    next(error);
  }
};
