import React, { useState } from 'react';
import { User, Calendar, Activity, Droplets, Heart, TrendingUp, Users } from 'lucide-react';

// --- Placeholder Components (for self-contained immersive) ---
// In a real project, these would be in separate files (e.g., components/Header.tsx)

interface HeaderProps {
  onTitleClick: () => void; // New prop for handling title clicks
}

const Header: React.FC<HeaderProps> = ({ onTitleClick }) => (
  <header className="bg-white shadow-sm py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1
        className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
        onClick={onTitleClick} // Attach the click handler here
      >
        CardioPredict AI
      </h1>
      {/* You can add navigation or other header elements here */}
    </div>
  </header>
);

interface PredictionResultProps {
  prediction: string;
  probability: number;
  onReset: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, probability, onReset }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Prediction Result</h2>
    <p className="text-xl text-gray-700 mb-2">{prediction}</p>
    <p className="text-2xl font-semibold text-blue-600 mb-6">
      Probability: {probability.toFixed(2)}%
    </p>
    <button
      onClick={onReset}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
    >
      Perform New Prediction
    </button>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    <p className="mt-4 text-lg text-gray-700">Analyzing data...</p>
  </div>
);
// --- End Placeholder Components ---


// Define the shape of the patient data
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

// Props for the main PatientForm component
interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  loading: boolean;
}

// --- PatientForm Component (Controlled) ---
const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, loading }) => {
  // State to hold all form data
  const [formData, setFormData] = useState<PatientData>({
    age: 0,
    anaemia: 0,
    creatinine_phosphokinase: 250,
    diabetes: 0,
    ejection_fraction: 38,
    high_blood_pressure: 0,
    platelets: 263000,
    serum_creatinine: 1.1,
    serum_sodium: 137,
    sex: 1,
    smoking: 0,
    time: 130
  });

  // Universal handler for all input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof PatientData,
    type: 'number' | 'select'
  ) => {
    const rawValue = e.target.value;
    let parsedValue: number;

    if (type === 'select') {
      parsedValue = Number(rawValue);
    } else { // type is 'number'
      if (rawValue === '') {
        // If input is cleared to empty, set to 0 or appropriate default
        parsedValue = 0; // Assuming 0 is the min for most numeric fields
      } else {
        const num = Number(rawValue);
        if (isNaN(num)) {
          // If input is invalid (e.g., non-numeric in a number field), do not update state
          // This prevents state corruption and helps maintain cursor focus.
          return;
        }
        parsedValue = num;
      }
    }

    // Update the specific field in formData
    setFormData(prev => ({ ...prev, [field]: parsedValue }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Call the onSubmit prop passed from the parent (App)
  };

  // Helper function to render a basic input field
  const renderInputField = (
    label: string,
    field: keyof PatientData,
    min?: number,
    max?: number,
    step?: number,
    unit?: string
  ) => {
    const value = formData[field];
    
    // Display empty string for 0 in boolean-like fields for better UX
    // This handles cases where 0 might represent 'No' or an unselected state
    const isBooleanLikeField = ['anaemia', 'diabetes', 'high_blood_pressure', 'sex', 'smoking'].includes(field as string);
    const displayedValue = (value === 0 && isBooleanLikeField) ? '' : String(value);

    return (
      <div className="space-y-2">
        <label htmlFor={field as string} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
          <input
            id={field as string}
            type="number"
            value={displayedValue} // Controlled input: value comes from state
            onChange={(e) => handleInputChange(e, field, 'number')} // Updates state on change
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
          />
          {unit && (
            <span className="absolute right-3 top-2 text-sm text-gray-500">{unit}</span>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render a basic select field
  const renderSelectField = (
    label: string,
    field: keyof PatientData,
    options: { value: number; label: string }[]
  ) => {
    const value = formData[field];
    return (
      <div className="space-y-2">
        <label htmlFor={field as string} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          id={field as string}
          value={value} // Controlled select: value comes from state
          onChange={(e) => handleInputChange(e, field, 'select')} // Updates state on change
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Demographics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Patient Demographics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInputField("Age", "age", 0, 120, 1, "years")}
          {renderSelectField("Sex", "sex", [{ value: 0, label: 'Female' }, { value: 1, label: 'Male' }])}
        </div>
      </div>

      {/* Medical History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Medical History</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSelectField("Diabetes", "diabetes", [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }])}
          {renderSelectField("High Blood Pressure", "high_blood_pressure", [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }])}
          {renderSelectField("Anaemia", "anaemia", [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }])}
          {renderSelectField("Smoking", "smoking", [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }])}
        </div>
      </div>

      {/* Cardiac Function */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">Cardiac Function</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInputField("Ejection Fraction", "ejection_fraction", 0, 80, 1, "%")}
          {renderInputField("Follow-up Period", "time", 0, 300, 1, "days")}
        </div>
      </div>

      {/* Laboratory Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Laboratory Results</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInputField("Creatinine Phosphokinase", "creatinine_phosphokinase", 0, 8000, 1, "mcg/L")}
          {renderInputField("Serum Creatinine", "serum_creatinine", 0, 10, 0.1, "mg/dL")}
          {renderInputField("Serum Sodium", "serum_sodium", 0, 150, 1, "mEq/L")}
          {renderInputField("Platelets", "platelets", 0, 900000, 1000, "kiloplatelets/mL")}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              <span>Predict Heart Failure Risk</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Main App component
export default function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = async (patientData: PatientData) => {
    setLoading(true);
    setError(null);
    setPrediction(null); // Clear previous prediction when a new one starts
    
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
      {/* Tailwind CSS CDN - IMPORTANT for styling to work */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <Header onTitleClick={handleReset} /> {/* Pass handleReset to Header */}
      
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
