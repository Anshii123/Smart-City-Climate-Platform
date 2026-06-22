import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPredictions = (params) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../ml-model/predict.py');
    
    const args = [
      scriptPath,
      '--lat', params.latitude.toString(),
      '--lng', params.longitude.toString(),
      '--elevation', params.elevation.toString(),
      '--temp', params.temperature.toString(),
      '--landcover', params.landCover,
      '--popdensity', params.populationDensity.toString(),
      '--energy', params.energyConsumption.toString(),
      '--aqi', params.aqi.toString(),
      '--greenness', params.urbanGreennessRatio.toString()
    ];

    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    execFile(pythonCmd, args, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`ML Model execution failed: ${stderr || error.message}`));
      }

      try {
        const predictions = JSON.parse(stdout);
        if (predictions.error) {
          return reject(new Error(`ML Model prediction error: ${predictions.error}`));
        }
        resolve(predictions);
      } catch (parseErr) {
        reject(new Error(`Failed to parse ML Model output: ${parseErr.message}. Output was: ${stdout}`));
      }
    });
  });
};
