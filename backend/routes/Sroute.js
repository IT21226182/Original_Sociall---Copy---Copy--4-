const router = require("express").Router();
const axios = require("axios"); // For making HTTP requests to the Flask app
let social = require("../models/Smod");

// Route to add social data
router.route("/add").post((req, res) => {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;

    const newSocial = new social({
        q1, q2, q3, q4, q5, q6, q7, q8, q9, q10
    });

    newSocial.save()
        .then(() => res.json("Added"))
        .catch((err) => res.status(500).json({ error: err.message }));
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

// Route to perform sentiment analysis using the Flask app
router.route("/sentiment-analysis").post(async (req, res) => {
    try {
        const responses = req.body.responses; // Expecting 5 open-ended responses

        // Validate input
        if (!responses || responses.length !== 5) {
            return res.status(400).json({ error: "Please provide exactly 5 open-ended responses." });
        }

        // Send request to Flask app for sentiment analysis
        const flaskResponse = await axios.post("http://localhost:5000/sentiment", {
            responses: responses
        });

        // Return the sentiment results from Flask
        res.json(flaskResponse.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to perform risk prediction using the Flask app
router.route("/risk-prediction").post(async (req, res) => {
    try {
        const { yes_no_answers, sentiment_results } = req.body; // Expecting 5 yes/no answers and 5 sentiment results

        // Validate input
        if (!yes_no_answers || !sentiment_results || yes_no_answers.length !== 5 || sentiment_results.length !== 5) {
            return res.status(400).json({ error: "Please provide exactly 5 yes/no answers and 5 sentiment results." });
        }

        // Send request to Flask app for risk prediction
        const flaskResponse = await axios.post("http://localhost:5000/risk-prediction", {
            yes_no_answers: yes_no_answers,
            sentiment_results: sentiment_results
        });

        // Return the risk prediction from Flask
        res.json(flaskResponse.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;