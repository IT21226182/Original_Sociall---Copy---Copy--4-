from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import joblib
import numpy as np
import pandas as pd
from sentipre import preprocessing_sentiment, vectorizer
from riskpre import preprocessing_risk

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the sentiment analysis model
with open("originalsvm_smodel.pkl", "rb") as f:
    sentiment_model = joblib.load(f)

# Load the risk prediction model
with open("randomforestp_model.pkl", "rb") as f:
    risk_model = joblib.load(f)

# Load stopwords
with open("stop/corpora/stopwords/english", "r") as file:
    sw = file.read().splitlines()

# Load vocabulary
vocab = pd.read_csv("vocabulary.txt", header=None)
tokens = vocab[0].tolist()

# Route for sentiment analysis
@app.route("/sentiment", methods=["POST"])
def sentiment_analysis():
    try:
        # Get open-ended responses from the request
        data = request.json
        responses = data.get("responses", [])  # List of 5 open-ended responses

        print("Incoming Responses:", responses)

        # Validate input
        if not responses or len(responses) != 5:
            return jsonify({"error": "Please provide exactly 5 open-ended responses."}), 400

        # Perform sentiment analysis
        sentiment_results = []
        for response in responses:
            # Preprocess the text
            preprocessed_text = preprocessing_sentiment(response, sw)

            print("Preprocessed Text:", preprocessed_text)

            # Vectorize the text
            vectorized_text = vectorizer([preprocessed_text], tokens)
            # Make a prediction
            prediction = sentiment_model.predict(vectorized_text)[0]
            sentiment_results.append(int(prediction))  # Convert to int (1 or 0)

            print("Sentiment Results:", sentiment_results)

        return jsonify({"sentiments": sentiment_results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for risk prediction
@app.route("/risk-prediction", methods=["POST"])
def risk_prediction():
    try:
        # Get yes/no answers and sentiment results from the request
        data = request.json
        yes_no_answers = data.get("yes_no_answers", [])  # List of 5 yes/no answers (1 or 0)
        sentiment_results = data.get("sentiment_results", [])  # List of 5 sentiment results (1 or 0)

        print("Incoming Yes/No Answers:", yes_no_answers)
        print("Incoming Sentiment Results:", sentiment_results)

        # Validate input
        if len(yes_no_answers) != 5 or len(sentiment_results) != 5:
            return jsonify({"error": "Please provide exactly 5 yes/no answers and 5 sentiment results."}), 400

        # Combine yes/no answers and sentiment results into a single input array
        combined_input = yes_no_answers + sentiment_results

        print("Combined Input:", combined_input)

        # Create a DataFrame with the correct feature names
        input_df = pd.DataFrame([combined_input], columns=["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"])

        # Preprocess the input data
        processed_input = preprocessing_risk(input_df)

        print("Processed Input:", processed_input)

        # Perform risk prediction
        risk_prediction = risk_model.predict(processed_input)[0]

        print("Risk Prediction:", risk_prediction)

        return jsonify({"risk_prediction": int(risk_prediction)})  # Convert to int (1 or 0)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)