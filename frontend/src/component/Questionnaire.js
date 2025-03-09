import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SocialHeader from './SocialHeader';
import downloadImg from './images/sback.jpg';

// Voice recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;

export default function Questionnaire() {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");
  const [q7, setQ7] = useState("");
  const [q8, setQ8] = useState("");
  const [q9, setQ9] = useState("");
  const [q10, setQ10] = useState("");

  const [listening, setListening] = useState(null);
  const [result, setResult] = useState(""); // State to store the risk prediction result
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const { lang } = useParams();
  const [translatedLabels, setTranslatedLabels] = useState({});
  const navigate = useNavigate();

  // Translations
  useEffect(() => {
    const translations = {
      english: {
        title: "Evaluation Form",
        q1: "1. Does your child make eye contact during conversations or interactions with family members or visitors?",
        q2: "2. Does your child get scared or react strongly to common household noises, such as grinding machines or temple/church bells?",
        q3: "3. Does your child prefer playing alone rather than joining other children in activities?",
        q4: "4. Does your child repeat words or phrases that seem out of context, like TV dialogues or songs?",
        q5: "5. Can your child understand simple instructions given, such as 'Give the book to Amma' or 'Bring your slippers'?",
        q6: "6. How does your child react when you call him/her by name during daily activities, such as at meal times or play?",
        q7: "7. How does your child behave in crowded places like markets, bus stands, or festivals?",
        q8: "8. How does your child let you know when he/she is hungry, thirsty, or wants something specific?",
        q9: "9. What does your child usually do when he/she is playing with objects like toys or household items?",
        q10: "10. How does your child react when asked to do something new or unfamiliar at home?",
        yes: "Yes",
        no: "No",
        speak: "🔊 Use your voice",
        submit: "Submit",
        resultMessage: "Risk Prediction:",
        close: "Close",
      },
      sinhala: {
        title: "ඇගයුම් පෝරමය",
        q1: "1. ඔබේ දරුවා පවුලේ සාමාජිකයන් හෝ අමුත්තන් සමඟ සංවාද හෝ අන්තර් ක්‍රියා වලදී ඇස දෙස බලා කතා කරනවාද?",
        q2: "2. ඇඹරුම් යන්ත්‍ර හෝ පන්සල්/පල්ලි සීනු වැනි සාමාන්‍ය ගෘහස්ථ ශබ්දවලට ඔබේ දරුවා බියට පත් වන්නේද නැතහොත් දැඩි ලෙස ප්‍රතිචාර දක්වනවාද?",
        q3: "3. ඔබේ දරුවා වෙනත් දරුවන් සමඟ ක්‍රියාකාරකම්වලට සම්බන්ධ වෙනවාට වඩා තනිවම සෙල්ලම් කිරීමට කැමතිද?",
        q4: "4. ඔබේ දරුවා රූපවාහිනී සංවාද හෝ ගීත වැනි සන්දර්භයෙන් බැහැරව පෙනෙන වචන හෝ වාක්‍ය ඛණ්ඩ නැවත නැවත කියනවාද?",
        q5: "5. 'අම්මාට පොත දෙන්න' හෝ 'ඔබේ සෙරෙප්පු රැගෙන එන්න' වැනි සරල උපදෙස් ඔබේ දරුවාට තේරුම් ගත හැකිද?",
        q6: "6. ආහාර වේලෙහි හෝ ක්‍රීඩා කරන විට වැනි දෛනික ක්‍රියාකාරකම් වලදී ඔබ ඔහුට/ඇයට නමින් කතා කරන විට ඔබේ දරුවා ප්‍රතිචාර දක්වන්නේ කෙසේද?",
        q7: "7. පොළවල්, බස් නැවතුම් පොළවල් හෝ උත්සව වැනි ජනාකීර්ණ ස්ථානවල ඔබේ දරුවා හැසිරෙන්නේ කෙසේද?",
        q8: "8. ඔබේ දරුවා ඔහුට/ඇයට බඩගිනි, පිපාසය, හෝ නිශ්චිත යමක් අවශ්‍ය වූ විට ඔහු ඔබට දන්වන්නේ කෙසේද?",
        q9: "9. ඔබේ දරුවා සෙල්ලම් බඩු හෝ ගෘහ භාණ්ඩ වැනි වස්තූන් සමඟ සෙල්ලම් කරන විට ඔහු/ඇය සාමාන්යයෙන් කරන්නේ කුමක්ද?",
        q10: "10. නිවසේදී අලුත් හෝ නුහුරු දෙයක් කිරීමට ඔබේ දරුවා ප්‍රතිචාරය දක්වන්නේ කෙසේද?",
        yes: "ඔව්",
        no: "නැත",
        speak: "🔊 හඬ භාවිතය",
        submit: "ඉදිරියට යන්න",
        resultMessage: "අවදානම් අනාවැකිය:",
        close: "වසන්න",
      },
      tamil: {
        title: "குழந்தை தனித்துவம் மதிப்பீடு",
        q1: "1. குடும்ப உறுப்பினர்கள் அல்லது பார்வையாளர்களுடனான உரையாடல்கள் அல்லது தொடர்புகளின் போது உங்கள் குழந்தை கண் தொடர்பு கொள்கிறதா?",
        q2: "2. அரைக்கும் இயந்திரங்கள் அல்லது கோவில்/தேவாலய மணி போன்ற பொதுவான வீட்டுச் சத்தங்களுக்கு உங்கள் குழந்தை பயப்படுகிறதா அல்லது கடுமையாக எதிர்வினையாற்றுகிறதா?",
        q3: "3. உங்கள் குழந்தை மற்ற குழந்தைகளுடன் சேர்ந்து விளையாடுவதை விட தனியாக விளையாடுவதை விரும்புகிறதா?",
        q4: "4. டிவி உரையாடல்கள் அல்லது பாடல்கள் போன்ற சூழலுக்கு அப்பாற்பட்ட வார்த்தைகள் அல்லது சொற்றொடர்களை உங்கள் குழந்தை மீண்டும் சொல்கிறாரா?",
        q5: "5. 'புத்தகத்தை அம்மாவிடம் கொடு' அல்லது 'உங்கள் செருப்புகளைக் கொண்டு வாருங்கள்' போன்ற எளிய வழிமுறைகளை உங்கள் குழந்தை புரிந்துகொள்ள முடியுமா?",
        q6: "6. உணவின் போது அல்லது விளையாடும் போது உங்கள் குழந்தை உங்கள் பெயரைச் சொல்லி அழைக்கும் போது அவர் எவ்வாறு பதிலளிப்பார்?",
        q7: "7. சந்தைகள், பேருந்து நிலையங்கள் அல்லது திருவிழாக்கள் போன்ற நெரிசலான இடங்களில் உங்கள் குழந்தை எப்படி நடந்து கொள்கிறது?",
        q8: "8. உங்கள் பிள்ளை பசியாக இருக்கும்போது, ​​தாகமாக இருக்கும்போது அல்லது குறிப்பிட்ட ஒன்றை விரும்பும்போது எப்படி உங்களுக்குத் தெரியப்படுத்துவார்?",
        q9: "9. உங்கள் பிள்ளை பொம்மைகள் அல்லது வீட்டுப் பொருட்கள் போன்ற பொருட்களை வைத்து விளையாடும்போது பொதுவாக என்ன செய்வார்?",
        q10: "10. வீட்டில் புதிய அல்லது அறிமுகமில்லாத ஒன்றை செய்யும்படி கேட்கப்படும் போது உங்கள் குழந்தை எவ்வாறு பதிலளிக்கிறார்?",
        yes: "ஆம்",
        no: "இல்லை",
        speak: "🔊 குரல் பயன்படுத்த",
        submit: "சமர்ப்பிக்கவும்",
        resultMessage: "அபாயம் கணிப்பு:",
        close: "மூடு",
      },
    };

    setTranslatedLabels(translations[lang]);
    document.title = translations[lang]?.title || "Autism Risk Assessment";
  }, [lang]);

  // Speech recognition
  function startListening(field) {
    setListening(field);

    if (lang === "sinhala") recognition.lang = "si-LK";
    else if (lang === "tamil") recognition.lang = "ta-LK";
    else recognition.lang = "en-US";

    recognition.start();
  }

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;

    if (listening === "q6") setQ6(spokenText);
    if (listening === "q7") setQ7(spokenText);
    if (listening === "q8") setQ8(spokenText);
    if (listening === "q9") setQ9(spokenText);
    if (listening === "q10") setQ10(spokenText);

    setListening(null);
  };

  recognition.onspeechend = () => recognition.stop();

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();

    const newSales = { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 };

    try {
      // Save the form data to the database
      await axios.post("http://localhost:8070/Sroute/add", newSales);

      // Prepare data for risk prediction
      const yesNoAnswers = [q1, q2, q3, q4, q5].map((answer) => (answer === "yes" ? 1 : 0));
      const openEndedResponses = [q6, q7, q8, q9, q10];

      // Get sentiment results from Flask
      const sentimentResponse = await axios.post("http://localhost:5000/sentiment", {
        responses: openEndedResponses,
      });
      const sentimentResults = sentimentResponse.data.sentiments;

      // Get risk prediction from Flask
      const riskResponse = await axios.post("http://localhost:5000/risk-prediction", {
        yes_no_answers: yesNoAnswers,
        sentiment_results: sentimentResults,
      });
      const riskPrediction = riskResponse.data.risk_prediction;

      // Set the result state and show the popup
      setResult(riskPrediction === 1 ? "Risk Detected" : "No Risk Detected");
      setShowPopup(true); // Show the popup
    } catch (err) {
      alert("Error submitting the form: " + err.message);
    }
  }

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Styles
  const containerStyle = {
    padding: "20px",
    backgroundColor: "#E8EFF4",
    overflow: "hidden",
    boxShadow: "0 2px 20px",
    borderRadius: "$radius",
    transition: "transform 200ms ease-in",
    padding: "20px",
    backdropFilter: "blur(50px)",
    maxWidth: "1000px",
    margin: "0 auto",
    marginTop: "50px",
    flexDirection: "column",
    alignItems: "center",
  };
  const labelStyle = {
    marginBottom: "8px",
    display: "block",
    color: "#1C325B",
    fontWeight: "bold",
  };
  const inputStyle = {
    width: "100%",
    marginBottom: "15px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
  };
  const buttonStyle = {
    backgroundImage: "linear-gradient(125deg,#1C325B,#4A628A)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    width: "20%",
    marginTop: "15px",
    marginLeft: "auto",
    display: "block",
  };
  const speakButtonStyle = {
    backgroundColor: "transparent",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    outline: "none",
    boxShadow: "none",
  };

  // Define lastFieldStyle
  const lastFieldStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: "20px",
  };

  // Popup styles
  const popupStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    textAlign: "center",
  };
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${downloadImg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: "100vw",
          height: "300vh",
        }}
      >
        <SocialHeader />
        <h3 style={{ textAlign: "center", fontWeight: "10px" }}>{translatedLabels.title}</h3>
        <form onSubmit={handleSubmit} style={containerStyle}>
          {[...Array(5).keys()].map((i) => (
            <div key={i} style={{ width: "100%" }}>
              <label style={labelStyle}>{translatedLabels[`q${i + 1}`]}</label>
              <select
                value={eval(`q${i + 1}`)}
                onChange={(e) => eval(`setQ${i + 1}(e.target.value)`)}
                style={inputStyle}
              >
                <option value="">{translatedLabels.yes}/{translatedLabels.no}</option>
                <option value="yes">{translatedLabels.yes}</option>
                <option value="no">{translatedLabels.no}</option>
              </select>
            </div>
          ))}

          {[...Array(5).keys()].map((i) => (
            <div key={i + 5} style={lastFieldStyle}>
              <label style={labelStyle}>{translatedLabels[`q${i + 6}`]}</label>
              <textarea
                value={eval(`q${i + 6}`)}
                onChange={(e) => eval(`setQ${i + 6}(e.target.value)`)}
                style={inputStyle}
                rows="2"
              />
              <button
                type="button"
                onClick={() => startListening(`q${i + 6}`)}
                style={speakButtonStyle}
              >
                {translatedLabels.speak}
              </button>
            </div>
          ))}
          <button type="submit" style={buttonStyle}>
            {translatedLabels.submit}
          </button>
        </form>

        {/* Popup for risk prediction result */}
        {showPopup && (
          <>
            <div style={overlayStyle} onClick={closePopup}></div>
            <div style={popupStyle}>
              <h3>{translatedLabels.resultMessage}</h3>
              <p>{result}</p>
              <button onClick={closePopup} style={buttonStyle}>
                {translatedLabels.close}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}