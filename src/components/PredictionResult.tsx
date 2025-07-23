import React from 'react';
import { AlertTriangle, CheckCircle, Heart, TrendingUp, Info } from 'lucide-react';

interface PredictionResultProps {
  prediction: string;
  probability: number;
  onReset: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, probability, onReset }) => {
  const isHighRisk = prediction.includes('Heart Failure');
  const riskLevel = probability > 80 ? 'Very High' : probability > 60 ? 'High' : probability > 40 ? 'Moderate' : 'Low';
  
  const getRiskColor = () => {
    if (probability > 80) return 'text-red-600 bg-red-50 border-red-200';
    if (probability > 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (probability > 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRecommendations = () => {
    if (probability > 80) {
      return [
        'Immediate cardiology consultation recommended',
        'Consider hospitalization for comprehensive evaluation',
        'Initiate heart failure medications as appropriate',
        'Daily weight monitoring and fluid restriction',
        'Frequent follow-up appointments'
      ];
    } else if (probability > 60) {
      return [
        'Urgent cardiology referral within 1-2 weeks',
        'Echocardiogram and BNP/NT-proBNP testing',
        'Optimize current medications',
        'Lifestyle modifications counseling',
        'Weekly monitoring initially'
      ];
    } else if (probability > 40) {
      return [
        'Cardiology consultation within 1 month',
        'Regular monitoring of cardiac function',
        'Address modifiable risk factors',
        'Patient education on warning signs',
        'Monthly follow-up appointments'
      ];
    } else {
      return [
        'Continue routine cardiac monitoring',
        'Maintain healthy lifestyle habits',
        'Regular primary care follow-up',
        'Monitor for new symptoms',
        'Annual cardiac assessment'
      ];
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Result Card */}
      <div className={`rounded-xl border-2 p-8 ${getRiskColor()}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {isHighRisk ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <CheckCircle className="w-8 h-8" />
            )}
            <div>
              <h2 className="text-2xl font-bold">Prediction Result</h2>
              <p className="text-sm opacity-80">AI-powered cardiac risk assessment</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{probability.toFixed(1)}%</div>
            <div className="text-sm font-medium">{riskLevel} Risk</div>
          </div>
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
          <p className="text-lg font-semibold mb-2">Clinical Assessment:</p>
          <p className="text-base">{prediction}</p>
        </div>

        {/* Risk Meter */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Risk Level</span>
            <span>{probability.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                probability > 80 ? 'bg-red-500' :
                probability > 60 ? 'bg-orange-500' :
                probability > 40 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(probability, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Clinical Recommendations</h3>
        </div>
        <div className="grid gap-3">
          {getRecommendations().map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-semibold text-gray-800">Important Notes</h4>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• This prediction is based on machine learning analysis of clinical parameters</p>
          <p>• Results should be interpreted in conjunction with clinical judgment</p>
          <p>• Model accuracy: 83.3% based on validation data</p>
          <p>• Always consider patient's complete clinical picture and history</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={onReset}
          className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <TrendingUp className="w-5 h-5" />
          <span>New Assessment</span>
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default PredictionResult;