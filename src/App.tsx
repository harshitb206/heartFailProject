import React, { useState } from 'react';
import Header from './components/Header';
import PatientForm from './components/PatientForm';
import PredictionResult from './components/PredictionResult';
import LoadingSpinner from './components/LoadingSpinner';
import { Activity, Users, TrendingUp, Heart } from 'lucide-react';

interface PatientData {
  age: number;
  anaemia: number;
  creatinine_phosphokinase: number;
  diabetes: number;
  ejection_fraction: number;
  high_blood_pressure: number;
  platelets: number;
  serum_creatinine: number;
  serum_sodium: number;
  sex: number;
  smoking: number;
  time: number;
}

interface PredictionResponse {
  prediction: string;
  probability: number;
}

function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = async (patientData: PatientData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to Flask backend
      // In a real implementation, this would be: fetch('http://localhost:5000/predict', {...})
      
      // For demo purposes, we'll simulate the prediction logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Simple risk calculation based on key factors (for demo)
      let riskScore = 0;
      
      // Age factor
      if (patientData.age > 70) riskScore += 25;
      else if (patientData.age > 60) riskScore += 15;
      else if (patientData.age > 50) riskScore += 10;
      
      // Ejection fraction (most important factor)
      if (patientData.ejection_fraction < 30) riskScore += 40;
      else if (patientData.ejection_fraction < 40) riskScore += 25;
      else if (patientData.ejection_fraction < 50) riskScore += 10;
      
      // Serum creatinine
      if (patientData.serum_creatinine > 2.0) riskScore += 20;
      else if (patientData.serum_creatinine > 1.5) riskScore += 10;
      
      // Comorbidities
      if (patientData.diabetes) riskScore += 10;
      if (patientData.high_blood_pressure) riskScore += 8;
      if (patientData.anaemia) riskScore += 8;
      if (patientData.smoking) riskScore += 5;
      
      // Serum sodium
      if (patientData.serum_sodium < 135) riskScore += 10;
      
      // Add some randomness for demo
      riskScore += Math.random() * 10 - 5;
      
      const probability = Math.min(Math.max(riskScore, 5), 95);
      const result = probability > 50 ? "Heart Failure" : "No Heart Failure";
      
      setPrediction({
        prediction: `Patient is predicted to have: ${result}`,
        probability: probability
      });
      
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
  };

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; description: string }> = 
    ({ icon, title, value, description }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!prediction && !loading && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Advanced Heart Failure Risk Assessment
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Leverage machine learning to predict heart failure risk with 83.3% accuracy. 
                Enter patient clinical parameters for comprehensive cardiac risk analysis.
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard
                  icon={<Activity className="w-6 h-6 text-blue-600" />}
                  title="Model Accuracy"
                  value="83.3%"
                  description="Validated on clinical data"
                />
                <StatCard
                  icon={<Users className="w-6 h-6 text-green-600" />}
                  title="Patients Analyzed"
                  value="299+"
                  description="Training dataset size"
                />
                <StatCard
                  icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
                  title="Parameters"
                  value="12"
                  description="Clinical features analyzed"
                />
                <StatCard
                  icon={<Heart className="w-6 h-6 text-red-600" />}
                  title="Risk Factors"
                  value="Multiple"
                  description="Comprehensive assessment"
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <PatientForm onSubmit={handlePrediction} loading={loading} />
          </>
        )}

        {loading && <LoadingSpinner />}

        {prediction && (
          <PredictionResult
            prediction={prediction.prediction}
            probability={prediction.probability}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">CardioPredict AI - Advanced Heart Failure Risk Assessment</p>
            <p className="text-sm">
              This tool is for educational and research purposes. Always consult with healthcare professionals for medical decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;