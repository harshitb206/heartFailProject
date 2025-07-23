import pandas as pd
from flask import Flask, request, render_template
import joblib


app = Flask(__name__)

# Load the trained model and scaler
model = joblib.load('heart_failure_model.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Get form data
        age = float(request.form['age'])
        anaemia = int(request.form['anaemia'])
        creatinine_phosphokinase = float(request.form['creatinine_phosphokinase'])
        diabetes = int(request.form['diabetes'])
        ejection_fraction = float(request.form['ejection_fraction'])
        high_blood_pressure = int(request.form['high_blood_pressure'])
        platelets = float(request.form['platelets'])
        serum_creatinine = float(request.form['serum_creatinine'])
        serum_sodium = float(request.form['serum_sodium'])
        sex = int(request.form['sex'])
        smoking = int(request.form['smoking'])
        time = float(request.form['time'])

        # Create a DataFrame from the input data
        input_data = pd.DataFrame([[age, anaemia, creatinine_phosphokinase, diabetes,
                                      ejection_fraction, high_blood_pressure, platelets,
                                      serum_creatinine, serum_sodium, sex, smoking, time]],
                                   columns=['age', 'anaemia', 'creatinine_phosphokinase', 'diabetes',
                                            'ejection_fraction', 'high_blood_pressure', 'platelets',
                                            'serum_creatinine', 'serum_sodium', 'sex', 'smoking', 'time'])

        # Scale the input data using the loaded scaler
        scaled_input_data = scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(scaled_input_data)[0]
        prediction_proba = model.predict_proba(scaled_input_data)[0]

        result = "Heart Failure" if prediction == 1 else "No Heart Failure"
        probability = prediction_proba[prediction] * 100

        return render_template('index.html', prediction_text=f'Patient is predicted to have: {result} with probability: {probability:.2f}%')

if __name__ == '__main__':
    app.run(debug=True)