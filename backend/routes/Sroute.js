const router = require("express").Router();
const axios = require("axios"); // For making HTTP requests to the Flask app
let social = require("../models/Smod");

// Route to add social data and perform analysis
router.route("/analyze").post(async (req, res) => {
  try {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;

    // Send open-ended responses to Flask for sentiment analysis
    const sentimentResponse = await axios.post("http://localhost:5000/sentiment", {
      responses: [q6, q7, q8, q9, q10],
    });
    const sentimentResults = sentimentResponse.data.sentiments;

    // Send Yes/No answers and sentiment results to Flask for risk prediction
    const riskResponse = await axios.post("http://localhost:5000/risk-prediction", {
      yes_no_answers: [q1, q2, q3, q4, q5],
      sentiment_results: sentimentResults,
    });
    const riskPrediction = riskResponse.data.risk_prediction;

    // Save data to MongoDB
    const newSocial = new social({ q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
      risk_prediction: riskPrediction === 1 ? "Risk Detected" : "No Risk Detected" // Store the prediction result
    });

    await newSocial.save();

    // Return risk prediction to frontend
    res.json({ risk_prediction: riskPrediction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get all social data
router.route("/").get((req, res) => {
  social.find()
    .then((Sroute) => res.json(Sroute))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Route to update social data
router.route("/update/:id").put(async (req, res) => {
  const questionId = req.params.id;
  const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;

  const updateSocial = { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 };

  social.findByIdAndUpdate(questionId, updateSocial)
    .then(() => res.status(200).send({ status: "Updated" }))
    .catch((err) => res.status(500).send({ status: "Error updating data", error: err.message }));
});

// Route to delete social data
router.route("/delete/:id").delete(async (req, res) => {
  const questionId = req.params.id;
  social.findByIdAndDelete(questionId)
    .then(() => res.status(200).send({ status: "Deleted" }))
    .catch((err) => res.status(500).send({ status: "Error deleting data", error: err.message }));
});

// Route to get a specific social data entry
router.route("/get/:id").get(async (req, res) => {
  const questionId = req.params.id;
  social.findById(questionId)
    .then((social) => res.status(200).send({ status: "Fetched", social }))
    .catch((err) => res.status(500).send({ status: "Error fetching data", error: err.message }));
});

module.exports = router;