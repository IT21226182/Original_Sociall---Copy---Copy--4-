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

  const { lang } = useParams();
  const [translatedLabels, setTranslatedLabels] = useState({});
  const navigate = useNavigate();

  // Translations
  useEffect(() => {
    const translations = {
      english: {
        title: "Questionnaire Assesment",
        q1: "1.	Does your child make eye contact during conversations or interactions with family members or visitors? ?",
        q2: "2.	Does your child get scared or react strongly to common household noises, such as grinding machines or temple/church bells?",
        q3: "3.	Does your child prefer playing alone rather than joining other children in activities?",
        q4: "4.	Does your child repeat words or phrases that seem out of context, like TV dialogues or songs?",
        q5: "5.	Can your child understand simple instructions given ,such as 'Give the book to Amma' or 'Bring your slippers'?",
        q6: "6.	How does your child react when you call him/her by name during daily activities, such as at meal times or play?",
        q7: "7.	How does your child behave in crowded places like markets, bus stands, or festivals?",
        q8: "8.	How does your child let you know when he/she is hungry, thirsty, or wants something specific? ",
        q9: "9.	What does your child usually do when he/she is playing with objects like toys or household items? ",
        q10: "10.	How does your child react when asked to do something new or unfamiliar at home? ",
        yes: "Yes",
        no: "No",
        speak: "🔊 Use your voice",
        submit: "Submit",
      },
      sinhala: {
        title: "වෛකල්ප අවදානම ඇගයීම",
        q1: "ඔබේ දරුවා අන් අය සමඟ ඇස් අයුතුද?",
        q2: "ඔබේ දරුවා නමට ප්‍රතිචාර දක්වන්නේද?",
        q3: "ඔබේ දරුවා ආසාවක් පෙන්වීමට අමුත්තනේද?",
        q4: "ඔබේ දරුවා වෙනත් අය සමඟ සන්සුන් දැනුම හුවමාරු කරන්නේද?",
        q5: "ඔබේ දරුවා ප්‍රහසන ක්‍රීඩා වලින් සම්බන්ධ ද?",
        q6: "ඔබේ දරුවා උච්ච ශබ්දවලට ප්‍රතිචාරය විස්තර කරන්න.",
        q7: "ඔබේ දරුවා අලුත් වටපිටාවල හැසිරීම විස්තර කරන්න.",
        q8: "ඔබේ දරුවා අවශ්‍යතාව පවසන ආකාරය විස්තර කරන්න.",
        q9: "ඔබේ දරුවා සමපාර්ශවිකයෝ සමඟ සම්බන්ධතාවය විස්තර කරන්න.",
        q10: "ඔබේ දරුවා සැලසුම් වෙනස්කම් වලට ප්‍රතිචාරය විස්තර කරන්න.",
        yes: "ඔව්",
        no: "නැත",
        speak: "🔊Use your voice",
        submit: "ඉදිරිපත් කරන්න",
      },
      tamil: {
        title: "குழந்தை தனித்துவம் மதிப்பீடு",
        q1: "1. குடும்ப உறுப்பினர்கள் அல்லது பார்வையாளர்களுடனான உரையாடல்கள் அல்லது தொடர்புகளின் போது உங்கள் குழந்தை கண் தொடர்பு கொள்கிறதா?",
        q2: "2. அரைக்கும் இயந்திரங்கள் அல்லது கோவில்/தேவாலய மணி போன்ற பொதுவான வீட்டுச் சத்தங்களுக்கு உங்கள் குழந்தை பயப்படுகிறதா அல்லது கடுமையாக எதிர்வினையாற்றுகிறதா?",
        q3: "3. உங்கள் குழந்தை மற்ற குழந்தைகளுடன் சேர்ந்து விளையாடுவதை விட தனியாக விளையாடுவதை விரும்புகிறதா?",
        q4: "4. டிவி உரையாடல்கள் அல்லது பாடல்கள் போன்ற சூழலுக்கு அப்பாற்பட்ட வார்த்தைகள் அல்லது சொற்றொடர்களை உங்கள் குழந்தை மீண்டும் சொல்கிறாரா?",
        q5: "5. 'புத்தகத்தை அம்மாவிடம் கொடு' அல்லது 'உங்கள் செருப்புகளைக் கொண்டு வாருங்கள்' போன்ற எளிய வழிமுறைகளை உங்கள் குழந்தை புரிந்துகொள்ள முடியுமா?",
        q6: "உங்கள் குழந்தை உயர்ந்த ஒலிகளுக்கு எப்படி பதிலளிக்கிறது என்பதை விவரிக்கவும்?",
        q7: "புதிய சூழலில் உங்கள் குழந்தையின் நடத்தை விவரிக்கவும்?",
        q8: "உங்கள் குழந்தை தேவைகளை தெரிவிக்க எப்படி செய்கிறார் என்பதை விவரிக்கவும்?",
        q9: "உங்கள் குழந்தையின் சகவாசிகளுடன் தொடர்பு எப்படி உள்ளது என்பதை விவரிக்கவும்?",
        q10: "உங்கள் குழந்தை திட்ட மாற்றங்களுக்கு எப்படி பதிலளிக்கிறது என்பதை விவரிக்கவும்?",
        yes: "ஆம்",
        no: "இல்லை",
        speak: "🔊 Use your voice",
        submit: "சமர்ப்பிக்கவும்",
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
  function handleSubmit(e) {
    e.preventDefault();

    const newSales = { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 };
    axios.post("http://localhost:8070/Sroute/add", newSales)
      .then(() => {
        alert("Form submitted successfully!");
        navigate("/view");
      })
      .catch((err) => alert("Error submitting the form: " + err));
  }

  // Styles
  const containerStyle = {
    padding: "20px",
    backgroundColor: "#E8EFF4",
    overflow: 'hidden',
    boxShadow: '0 2px 20px',
    borderRadius: '$radius',
    transition: 'transform 200ms ease-in',
    padding: '20px',
    backdropFilter: 'blur(50px)',
   // background:
      //'linear-gradient(rgba(255, 255, 255, 0.7),rgba(255, 255, 255, 0.3))',
    maxWidth: "600px",
    margin: "0 auto",
    marginTop: "50px",
    //display: "flex",
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
    //backgroundColor: "#1C325B",
    backgroundImage: "linear-gradient(125deg,#1C325B,#4A628A)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    width: "20%",
    marginTop: "15px",
    
    
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

  // Specific styles for last 5 fields
  const lastFieldStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: "20px",
  };

  return (
    <>
    
    
    
    <SocialHeader />
    
    <div style={{
      //backgroundImage:`url("./images/sback.jpg")`,
      backgroundImage: `url(${downloadImg})`,
      backgroundRepeat:"no-repeat",
      backgroundSize:"cover",
      width: '100vw',
    height: '300vh'
      
}}>
      <h3 style={{ textAlign: "center" }}>{translatedLabels.title}</h3>
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
              rows="4"
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
    </div>
    </>
  );
}
