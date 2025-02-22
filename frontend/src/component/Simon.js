import React, { useState, useEffect } from "react";
import simonTalking from "./images/simon.gif";
import simonTouchNose from "./images/hi.gif";
import simonWave from "./images/simon4.gif";
import simonSpin from "./images/simon5.gif";
import simonSad from "./images/dislike.jpg";
import goodJobImage from "./images/simon4.gif";
import goodJobSound from "./images/aw.mp3";
import wrongSound from "./images/no.wav";  // Add wrong sound here
import hugImage from "./images/hug.gif";
import jumpImage from "./images/jumpy.gif";
import SocialHeader from './SocialHeader';
import downloadImg from './images/sback.jpg';

const levels = {
  1: [
    { text: "Simon says, say hello", valid: true, actionImage: simonTouchNose },
    { text: "Jump three times", valid: false, actionImage: jumpImage },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },


  ],
  2: [
    { text: "Clap your hands", valid: false, actionImage: simonSad },
    { text: "Simon says, Show me a happy face!", valid: true, actionImage: simonSpin },
    { text: "Simon says, Look at my eyes", valid: true, actionImage: simonSpin },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },
  ],
  3: [
    { text: "Simon says, Give a high-five", valid: true, actionImage: simonSpin },
    { text: "Simon says, Say 'thank you' with a smile", valid: true, actionImage: simonSpin },
    { text: "Simon says, Raise your hand and wait!", valid: true, actionImage: simonSpin },
    { text: "Simon says, Say 'I like your drawing!' to a mom!", valid: true, actionImage: simonSpin },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },
  ],
};

export default function SimonSaysGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showActionImage, setShowActionImage] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [finalScore, setFinalScore] = useState(null);
  const [showGoodJob, setShowGoodJob] = useState(false);
  const [showIncorrectImage, setShowIncorrectImage] = useState(false);  // New state for incorrect image

  const currentCommand = levels[currentLevel]?.[currentIndex] || {};

  const speakCommand = () => {
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = speakCommand;
      return;
    }

    setShowActionImage(true);
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(currentCommand.text);
      utterance.voice = voices.find((voice) => voice.name.includes("Male")) || voices[0];

      setIsSpeaking(true);
      setShowGoodJob(false);
      setShowIncorrectImage(false);  // Reset incorrect image

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }, 100);
  };

  useEffect(() => {
    if (gameStarted) {
      speakCommand();
    }
  }, [currentIndex, gameStarted]);

  const handleResponse = (isCorrect) => {
    if (!gameStarted) return;

    const isSimonSays = currentCommand.text.startsWith("Simon says");
    const newAttempts = attempts + 1; // Track attempts correctly before updating state

    if ((isSimonSays && isCorrect) || (!isSimonSays && !isCorrect)) {
        setScore(prevScore => prevScore + 1);
        setActionStatus("correct");
        setShowGoodJob(true);
        new Audio(goodJobSound).play();
    } else {
        setActionStatus("incorrect");
        setShowIncorrectImage(true);
        new Audio(wrongSound).play();
        setShowGoodJob(false);
    }

    setAttempts(newAttempts); // Ensure the correct attempts count is used
    setTimeout(() => moveToNextCommand(newAttempts), 2000);
};

const moveToNextCommand = (updatedAttempts) => {
    console.log(`Score: ${score}, Attempts: ${updatedAttempts}`);

    if (currentIndex + 1 >= levels[currentLevel].length) {
        const finalScorePercentage = updatedAttempts > 0 ? Math.round((score / updatedAttempts) * 100) : 0;
        setFinalScore(finalScorePercentage);
        alert(`Level ${currentLevel} Complete! Score: ${finalScorePercentage}%`);
        console.log(`Calculated Percentage: ${(score / updatedAttempts) * 100}`);
        resetGame();
    } else {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setActionStatus("");
        setShowActionImage(false);
        setShowGoodJob(false);
        setShowIncorrectImage(false);
    }
};





  const resetGame = () => {
    setGameStarted(false);
    setCurrentIndex(0);
    setScore(0);
    setAttempts(0);
    setActionStatus("");
    setFinalScore(null);
    setShowActionImage(false);
    setShowGoodJob(false);
    setShowIncorrectImage(false);  // Reset incorrect image
    setCurrentLevel(null);
  };

  const startLevel = (level) => {
    setCurrentLevel(level);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setCurrentIndex(0);
    setActionStatus("");
    setFinalScore(null);
    setShowActionImage(false);
    setShowGoodJob(false);
    setShowIncorrectImage(false);  // Reset incorrect image
  };

  const getImageForAction = () => {
    if (isSpeaking) {
      return simonTalking;
    } else if (showGoodJob) {
      return goodJobImage;
    } else if (showIncorrectImage) {
      return simonSad;  // Display the sad image when incorrect
    }
    return currentCommand.actionImage || simonTalking;
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
    marginTop: "18px",
    marginLeft: "600px",
    marginRight: "100px", // Add this to center the button
    display: "block",   // Ensure it's treated as a block element
    textAlign: "center",
};

const buttonStyle1 = {
  backgroundImage: "#FF0000",
  color: "#FF0000",
  padding: "12px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  width: "20%",
  marginTop: "5px", 
  marginLeft: "600px",
  marginRight: "100px", // Add this to center the button
  display: "block",   // Ensure it's treated as a block element
  textAlign: "center",
};

const buttonStyle2 = {
  backgroundImage: "#008000",
  color: "#008000",
  padding: "12px 20px",
  borderRadius: "15px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  width: "20%",
  marginTop: "15px",
  marginLeft: "600px",
  marginRight: "100px", // Add this to center the button
  display: "block",   // Ensure it's treated as a block element
  textAlign: "center",
};



  return (
    <>
    
    <div style={{
      //backgroundImage:`url("./images/sback.jpg")`,
      backgroundImage: `url(${downloadImg})`,
      backgroundRepeat:"no-repeat",
      backgroundSize:"cover",
      width: '100vw',
    height: '300vh'
      
}}>
  <SocialHeader />
  {/* <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 p-6">
  <div className="bg-yellow-100 shadow-lg rounded-2xl p-6 w-full max-w-md text-center"> */}

     <center>   <h1 className="text-xl font-bold mb-4">Simon Says Game</h1></center>

        {!gameStarted ? (
          currentLevel === null ? (
            <div>
         <center>   <h2 >Select a Level</h2></center> 
              {[1, 2, 3].map((level) => (
                <button
                style={buttonStyle}
                  key={level}
                  onClick={() => startLevel(level)}
                  //className="bg-blue-500 text-white px-4 py-2 rounded-xl m-2 hover:bg-blue-600"
                >
                  Level {level}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <center><h2 >Level {currentLevel} Selected</h2></center>
              <button
              style={buttonStyle}
                onClick={startGame}
               // className="bg-green-500 text-white px-4 py-2 rounded-xl m-2 hover:bg-green-600"
              >
                Start Game
              </button>
            </div>
          )
        ) : (
          <>
          <center>
            <img
              src={getImageForAction()}
              alt="Simon Character"
              
            />
            <p className="text-lg mb-4">{currentCommand.text}</p> </center>
            <div className="flex space-x-4">
              <button
              style={buttonStyle2}
                onClick={() => handleResponse(true)}
                // className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
              >
                Child Did ✅
              </button>
              <button
              style={buttonStyle1}
                onClick={() => handleResponse(false)}
                // className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Child Didn't ❌
              </button>
            </div>
           <center> <p >Score: {score} | Attempts: {attempts}/{levels[currentLevel].length}</p> </center>
          </>
        )}
      </div>
    {/* </div>
    </div> */}
    </>
  );
}
