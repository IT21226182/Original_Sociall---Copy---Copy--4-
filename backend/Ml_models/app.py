from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sentipre import preprocessing_sentiment, vectorizer
from riskpre import preprocessing_risk

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the sentiment analysis models
with open("q1_new_risk.pkl", "rb") as f:
    sentiment_model_1 = joblib.load(f)

with open("q3_new_risk.pkl", "rb") as f:
    sentiment_model_2 = joblib.load(f)

# Load the risk prediction model
with open("randomforest_model_secondtry_v2.pkl", "rb") as f:
    risk_model = joblib.load(f)

# Load stopwords
with open("stop/corpora/stopwords/english", "r") as file:
    sw = file.read().splitlines()

# Load vocabularies
vocab1 = pd.read_csv("vocabq1/vocabulary.txt", header=None)
tokens1 = vocab1[0].tolist()

vocab2 = pd.read_csv("vocabq3/vocabulary.txt", header=None)
tokens2 = vocab2[0].tolist()

# Route for sentiment analysis
@app.route("/sentiment", methods=["POST"])
def sentiment_analysis():
    try:
        data = request.json
        q9 = data.get("q9", "")
        q10 = data.get("q10", "")

        print(f"Received Q9: {q9}")
        print(f"Received Q10: {q10}")

        # Preprocess and predict Q9
        preprocessed_q9 = preprocessing_sentiment(q9, sw)

        print(f"Preprocessed Q9: {preprocessed_q9}")
        vectorized_q9 = vectorizer([preprocessed_q9], tokens1)
        prediction_q9 = sentiment_model_1.predict(vectorized_q9)[0]
        print(f"Prediction for Q9: {prediction_q9}")

        # Preprocess and predict Q10
        preprocessed_q10 = preprocessing_sentiment(q10, sw)
        print(f"Preprocessed Q10: {preprocessed_q10}")

        vectorized_q10 = vectorizer([preprocessed_q10], tokens2)
        prediction_q10 = sentiment_model_2.predict(vectorized_q10)[0]

        print(f"Prediction for Q10: {prediction_q10}")


        return jsonify({"sentiment_q9": int(prediction_q9), "sentiment_q10": int(prediction_q10)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for risk prediction
@app.route("/risk-prediction", methods=["POST"])
def risk_prediction():
    try:
        data = request.json
        yes_no_answers = data.get("yes_no_answers", [])
        sentiment_q9 = data.get("sentiment_q9", 0)
        sentiment_q10 = data.get("sentiment_q10", 0)

      

        print(f"Received Yes/No Answers: {yes_no_answers}")
        print(f"Received Sentiment Q9: {sentiment_q9}")
        print(f"Received Sentiment Q10: {sentiment_q10}")

        # Validate input
        if len(yes_no_answers) != 8:
            return jsonify({"error": "Please provide exactly 8 yes/no answers."}), 400

        # Convert yes/no answers into a DataFrame
        yes_no_df = pd.DataFrame([yes_no_answers], columns=["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"])

        # Preprocess the yes/no answers
        processed_input = preprocessing_risk(yes_no_df)
        print(f"Processed Yes/No Answers: {processed_input}")

        # Combine processed yes/no answers and sentiment results
        combined_input = processed_input.values.flatten().tolist() + [sentiment_q9, sentiment_q10]
        print(f"Combined Input for Risk Prediction: {combined_input}")

        # Create a DataFrame with the correct feature names
        input_df = pd.DataFrame([combined_input], columns=["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"])

        # Perform risk prediction
        risk_prediction = risk_model.predict(input_df)[0]
        print(f"Risk Prediction: {risk_prediction}")

        return jsonify({"risk_prediction": int(risk_prediction)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)