import axios from "axios";
import React, { useState, useEffect } from "react";
import SocialHeader from './SocialHeader';
import { useNavigate } from "react-router-dom";
import downloadImg from './images/sback.jpg';

const Edit = () => {
  const [id, setid] = useState(" ");
  const [q1, setq1] = useState("");
  const [q2, setq2] = useState("");
  const [q3, setq3] = useState("");
  const [q4, setq4] = useState("");
  const [q5, setq5] = useState("");
  const [q6, setq6] = useState("");
  const [q7, setq7] = useState("");
  const [q8, setq8] = useState("");
  const [q9, setq9] = useState("");
  const [q10, setq10] = useState("");

  const [result, setResult] = useState(""); // State to store the risk prediction result
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const navigate = useNavigate();

  useEffect(() => {
    setid(localStorage.getItem("id"));
    setq1(localStorage.getItem("q1"));
    setq2(localStorage.getItem("q2"));
    setq3(localStorage.getItem("q3"));
    setq4(localStorage.getItem("q4"));
    setq5(localStorage.getItem("q5"));
    setq6(localStorage.getItem("q6"));
    setq7(localStorage.getItem("q7"));
    setq8(localStorage.getItem("q8"));
    setq9(localStorage.getItem("q9"));
    setq10(localStorage.getItem("q10"));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Id...", id);
    const updatedData = {
      q1: q1,
      q2: q2,
      q3: q3,
      q4: q4,
      q5: q5,
      q6: q6,
      q7: q7,
      q8: q8,
      q9: q9,
      q10: q10
    };

    try {
      // Send data to Express.js for analysis and saving
      const response = await axios.put(`http://localhost:8070/Sroute/update/${id}`, updatedData);
      const riskPrediction = response.data.risk_prediction;

      // Set the result state and show the popup
      setResult(riskPrediction === 1 ? "Risk Detected" : "No Risk Detected");
      setShowPopup(true); // Show the popup
    } catch (err) {
      alert("Error updating the form: " + err.message);
    }
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
    navigate('/view');
  };

  // Styles
  const inputStyle = {
    display: "block",
    width: "100%",
    height: "36px",
    borderWidth: "0 0 2px 0",
    borderColor: "#1C325B",
    fontSize: "18px",
    fontWeight: "400",
    lineHeight: '26px',
    marginTop: "10px"
  };

  const buttonStyle = {
    display: "inline-block",
    backgroundImage: "linear-gradient(125deg,#1C325B,#4A628A)",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontSize: "16px",
    width: "150px",
    height: "36px",
    border: "none",
    cursor: "pointer",
    marginRight: "5px",
    float: "right",
    marginTop: "20px",
  };

  const lableStyle = {
    color: "#1C325B",
    marginTop: "10px"
  };

  const lableStyle1 = {
    color: "#1C325B",
    fontWeight: "500",
  };

  const cardstyle = {
    overflow: "hidden",
    boxShadow: "0 2px 20px ",
    borderRadius: "$radius",
    transition: "transform 200ms ease-in",
    padding: "20px",
    backdropFilter: "blur(5px)",
    background: "linear-gradient(rgba(255, 255, 255, 0.7),rgba(255, 255, 255, 0.3))",
    width: "1000px",
    marginLeft: "290px"
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
      <div style={{
        backgroundImage: `url(${downloadImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: '100vw',
        height: '300vh'
      }}>
        <SocialHeader />
        <div style={{ marginLeft: "630px" }}><br /><br />
          <label for="topic" style={lableStyle1}><h3>Update Response</h3></label>
        </div>
        <div style={{ marginTop: "10px", marginLeft: "860px" }}>
        </div>
        <br></br>
        <form onSubmit={handleUpdate}>
          <div style={cardstyle}>
            <div className="form-group">
              <label for="q1" style={lableStyle}>1. Does your child make eye contact during conversations or interactions with family members or visitors?</label>
              <input type="text" className="form-control" id="q1" placeholder="Enter itemNumber" style={inputStyle}
                value={q1}
                onChange={(e) => {
                  setq1(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q2" style={lableStyle}>2. Does your child get scared or react strongly to common household noises, such as grinding machines or temple/church bells?</label>
              <input type="text" className="form-control" id="q2" placeholder="Enter itemName" style={inputStyle}
                value={q2}
                onChange={(e) => {
                  setq2(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q3" style={lableStyle}>3. Does your child prefer playing alone rather than joining other children in activities?</label>
              <input type="text" className="form-control" id="q3" placeholder="Enter price" style={inputStyle}
                value={q3}
                onChange={(e) => {
                  setq3(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q4" style={lableStyle}>4. Does your child repeat words or phrases that seem out of context, like TV dialogues or songs?</label>
              <input type="text" className="form-control" id="q4" placeholder="Enter quantity" style={inputStyle}
                value={q4}
                onChange={(e) => {
                  setq4(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q5" style={lableStyle}>5. Can your child understand simple instructions given, such as 'Give the book to Amma' or 'Bring your slippers'?</label>
              <input type="text" className="form-control" id="q5" placeholder="Enter discount" style={inputStyle}
                value={q5}
                onChange={(e) => {
                  setq5(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q6" style={lableStyle}>6. How does your child react when you call him/her by name during daily activities, such as at meal times or play?</label>
              <input className="form-control" id="q6" placeholder="q6" style={inputStyle}
                value={q6}
                onChange={(e) => {
                  setq6(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q7" style={lableStyle}>7. How does your child behave in crowded places like markets, bus stands, or festivals?</label>
              <input className="form-control" id="q7" placeholder="q7" style={inputStyle}
                value={q7}
                onChange={(e) => {
                  setq7(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q8" style={lableStyle}>8. How does your child let you know when he/she is hungry, thirsty, or wants something specific?</label>
              <input className="form-control" id="q8" placeholder="q8" style={inputStyle}
                value={q8}
                onChange={(e) => {
                  setq8(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q9" style={lableStyle}>9. What does your child usually do when he/she is playing with objects like toys or household items?</label>
              <input className="form-control" id="q9" placeholder="q9" style={inputStyle}
                value={q9}
                onChange={(e) => {
                  setq9(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label for="q10" style={lableStyle}>10. How does your child react when asked to do something new or unfamiliar at home?</label>
              <input className="form-control" id="q10" placeholder="q10" style={inputStyle}
                value={q10}
                onChange={(e) => {
                  setq10(e.target.value);
                }}
              />
            </div>

            <div>
              <button type="submit" class="btn btn-primary" style={buttonStyle}>Update</button>
            </div>
          </div>
        </form>

        {/* Popup for risk prediction result */}
        {showPopup && (
          <>
            <div style={overlayStyle} onClick={closePopup}></div>
            <div style={popupStyle}>
              <h3>Risk Prediction:</h3>
              <p>{result}</p>
              <button onClick={closePopup} style={buttonStyle}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Edit;    