import React, { useState } from 'react';
import { User, Calendar, Activity, Droplets, Heart, TrendingUp } from 'lucide-react';

// Ensure Tailwind CSS is loaded for the styling to work
// This script tag should ideally be in your public/index.html head,
// but for a self-contained immersive, we can include it here.
// <script src="https://cdn.tailwindcss.com"></script>


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

// Main App component to render PatientForm
export default function App() {
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  const handleFormSubmit = (data: PatientData) => {
    setLoading(true); // Start loading
    setPredictionResult(null); // Clear previous result
    console.log("Form data received in App component:", data);

    // Simulate an API call or prediction process
    setTimeout(() => {
      setLoading(false); // End loading
      setPredictionResult("Risk analysis complete! (Simulated result)");
      // In a real app, you'd process 'data' and set a meaningful result here.
    }, 2000); // Simulate a 2-second delay
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Tailwind CSS CDN - IMPORTANT for styling to work */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          Heart Failure Prediction
        </h1>
        
        {/* Render the PatientForm, passing the onSubmit handler and loading state */}
        <PatientForm onSubmit={handleFormSubmit} loading={loading} />

        {/* Display prediction result if available */}
        {predictionResult && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-md text-center text-lg font-medium animate-fade-in">
            {predictionResult}
          </div>
        )}
      </div>
    </div>
  );
}
