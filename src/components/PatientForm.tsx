import React, { useState } from 'react';
import { User, Calendar, Activity, Droplets, Heart, TrendingUp } from 'lucide-react';

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

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  loading: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<PatientData>({
    age: 65,
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

  const handleInputChange = (field: keyof PatientData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const InputField: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    type?: 'number' | 'select';
    options?: { value: number; label: string }[];
  }> = ({ label, value, onChange, min, max, step = 1, unit, type = 'number', options }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          {options?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
          />
          {unit && (
            <span className="absolute right-3 top-2 text-sm text-gray-500">{unit}</span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection title="Patient Demographics" icon={<User className="w-5 h-5 text-blue-600" />}>
        <InputField
          label="Age"
          value={formData.age}
          onChange={(value) => handleInputChange('age', value)}
          min={18}
          max={120}
          unit="years"
        />
        <InputField
          label="Sex"
          value={formData.sex}
          onChange={(value) => handleInputChange('sex', value)}
          type="select"
          options={[
            { value: 0, label: 'Female' },
            { value: 1, label: 'Male' }
          ]}
        />
      </FormSection>

      <FormSection title="Medical History" icon={<Calendar className="w-5 h-5 text-green-600" />}>
        <InputField
          label="Diabetes"
          value={formData.diabetes}
          onChange={(value) => handleInputChange('diabetes', value)}
          type="select"
          options={[
            { value: 0, label: 'No' },
            { value: 1, label: 'Yes' }
          ]}
        />
        <InputField
          label="High Blood Pressure"
          value={formData.high_blood_pressure}
          onChange={(value) => handleInputChange('high_blood_pressure', value)}
          type="select"
          options={[
            { value: 0, label: 'No' },
            { value: 1, label: 'Yes' }
          ]}
        />
        <InputField
          label="Anaemia"
          value={formData.anaemia}
          onChange={(value) => handleInputChange('anaemia', value)}
          type="select"
          options={[
            { value: 0, label: 'No' },
            { value: 1, label: 'Yes' }
          ]}
        />
        <InputField
          label="Smoking"
          value={formData.smoking}
          onChange={(value) => handleInputChange('smoking', value)}
          type="select"
          options={[
            { value: 0, label: 'No' },
            { value: 1, label: 'Yes' }
          ]}
        />
      </FormSection>

      <FormSection title="Cardiac Function" icon={<Heart className="w-5 h-5 text-red-600" />}>
        <InputField
          label="Ejection Fraction"
          value={formData.ejection_fraction}
          onChange={(value) => handleInputChange('ejection_fraction', value)}
          min={10}
          max={80}
          unit="%"
        />
        <InputField
          label="Follow-up Period"
          value={formData.time}
          onChange={(value) => handleInputChange('time', value)}
          min={1}
          max={300}
          unit="days"
        />
      </FormSection>

      <FormSection title="Laboratory Results" icon={<Activity className="w-5 h-5 text-purple-600" />}>
        <InputField
          label="Creatinine Phosphokinase"
          value={formData.creatinine_phosphokinase}
          onChange={(value) => handleInputChange('creatinine_phosphokinase', value)}
          min={20}
          max={8000}
          unit="mcg/L"
        />
        <InputField
          label="Serum Creatinine"
          value={formData.serum_creatinine}
          onChange={(value) => handleInputChange('serum_creatinine', value)}
          min={0.5}
          max={10}
          step={0.1}
          unit="mg/dL"
        />
        <InputField
          label="Serum Sodium"
          value={formData.serum_sodium}
          onChange={(value) => handleInputChange('serum_sodium', value)}
          min={110}
          max={150}
          unit="mEq/L"
        />
        <InputField
          label="Platelets"
          value={formData.platelets}
          onChange={(value) => handleInputChange('platelets', value)}
          min={25000}
          max={900000}
          step={1000}
          unit="kiloplatelets/mL"
        />
      </FormSection>

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

export default PatientForm;