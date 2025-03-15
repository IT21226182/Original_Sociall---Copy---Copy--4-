import React, { useState, useEffect } from "react";
import simonTalking from "./images/simonok.gif";
import simonSad from "./images/saddd.png";
import goodJobImage from "./images/micky.png";
import goodJobSound from "./images/aw.mp3";
import wrongSound from "./images/no.wav";
import hugImage from "./images/hug.gif";
import SocialHeader from './SocialHeader';
import downloadImg from './images/sback.jpg';
import helloImg from './images/removeh.png';
import jumpImg from './images/removejump.png';
import noseImg from './images/removenose.png';
import smileImg from './images/removesmile.png';
import waveImg from './images/removewavee.png';

import ltw1Img from './images/removewavee.png';
import ltw2Img from './images/removewavee.png';
import ltw3Img from './images/removewavee.png';
import ltw4Img from './images/removewavee.png';
import ltw5Img from './images/removewavee.png';
import ltw6Img from './images/removewavee.png';
import ltw7Img from './images/removewavee.png';
import ltw8Img from './images/removewavee.png';
import ltw9Img from './images/removewavee.png';


import lth1Img from './images/removewavee.png';
import lth2Img from './images/removewavee.png';
import lth3Img from './images/removewavee.png';
import lth4Img from './images/removewavee.png';
import lth5Img from './images/removewavee.png';
import lth6Img from './images/removewavee.png';
import lth7Img from './images/removewavee.png';
import lth8Img from './images/removewavee.png';
import lth9Img from './images/removewavee.png';
import lth10Img from './images/removewavee.png';
import lth11Img from './images/removewavee.png';
import lth12Img from './images/removewavee.png';



const levels = {
  1: [
    { text: "Simon says, say hello", valid: true, actionImage: helloImg },
    { text: "Jump three times", valid: false, actionImage: jumpImg },
    { text: "Simon says touch your nose", valid: true, actionImage: noseImg },
    { text: "Wave your hands", valid: false, actionImage: waveImg },
    { text: "Simon says smile", valid: true, actionImage: smileImg},
  ],
  2: [
    { text: "Simon says show me a happy face", valid: true, actionImage: ltw1Img },
    { text: "Show me a sad face", valid: false, actionImage: ltw2Img },
    { text: "Simon says show me an angry face ", valid: true, actionImage: ltw3Img },
    { text: "Simon says say Smile big", valid: true, actionImage: ltw4Img },
    { text: "Wiggle your fingers and then say thank you.", valid: false, actionImage: ltw5Img },
    { text: "Look at the screen", valid: false, actionImage: ltw6Img },
    { text: "Show me a sad face", valid: false, actionImage: ltw7Img },
    { text: "Simon says Clap your hands", valid: true, actionImage: ltw8Img },
    { text: "Simon says Wave at the screen", valid: true, actionImage: ltw9Img },
  ],
  3: [
    { text: "Simon says, Give a high-five", valid: true, actionImage: lth1Img },
    { text: "Simon says, Say 'thank you' with a smile", valid: true, actionImage: lth2Img },
    { text: "Simon says, Raise your hand", valid: true, actionImage: waveImg },
    { text: "Say 'I like your drawing!' to a mom!", valid: false, actionImage: waveImg },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: hugImage },
    { text: "Make a silly face.", valid: false, actionImage: hugImage },
    { text: "Whisper your favorite color", valid: false, actionImage: simonSad },
    { text: "Show me a sad face", valid: false, actionImage: waveImg },
    { text: "Simon says Touch your ears and then your elbows.", valid: true, actionImage: waveImg },
    { text: "Simon says Pat your knees", valid: true, actionImage: hugImage },
    { text: "Close your eyes and count to five.", valid: false, actionImage: hugImage },
    { text: "Simon says Count to three out loud", valid: true, actionImage: simonSad },
  ],
};

const Modal = ({ finalScore, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
      }}>
        <h2>Level Complete!</h2>
        <p>Your final score is: {finalScore}%</p>
        <button onClick={onClose} style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#4A628A',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
          Close
        </button>
      </div>
    </div>
  );
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
  const [showIncorrectImage, setShowIncorrectImage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentCommand = levels[currentLevel]?.[currentIndex] || {};

  const speakCommand = () => {
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = speakCommand;
      return;
    }

    setShowActionImage(true);
    const utterance = new SpeechSynthesisUtterance(currentCommand.text);
    utterance.voice = voices.find((voice) => voice.name.includes("Male")) || voices[0];

    setIsSpeaking(true);
    setShowGoodJob(false);
    setShowIncorrectImage(false);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (gameStarted) {
      speakCommand();
    }
  }, [currentIndex, gameStarted]);

  const handleResponse = (isCorrect) => {
    if (!gameStarted) return;

    const isSimonSays = currentCommand.text.startsWith("Simon says");
    const newAttempts = attempts + 1;

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

    setAttempts(newAttempts);
    setTimeout(() => moveToNextCommand(newAttempts), 2000);
  };

  const moveToNextCommand = (updatedAttempts) => {
    if (currentIndex + 1 >= levels[currentLevel].length) {
      const finalScorePercentage = updatedAttempts > 0 ? Math.round((score / updatedAttempts) * 100) : 0;
      setFinalScore(finalScorePercentage);
      setShowModal(true);
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
    setShowIncorrectImage(false);
    setCurrentLevel(null);
    setShowModal(false);
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
    setShowIncorrectImage(false);
  };

  const getImageForAction = () => {
    if (isSpeaking) {
      return simonTalking;
    } else if (showGoodJob) {
      return goodJobImage;
    } else if (showIncorrectImage) {
      return simonSad;
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
    marginRight: "100px",
    display: "block",
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
    marginRight: "100px",
    display: "block",
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
    marginRight: "100px",
    display: "block",
    textAlign: "center",
  };

  return (
    <>
      <div style={{
        backgroundImage: `url(${downloadImg})`,
        backgroundRepeat:"no-repeat",
        backgroundSize:"cover",
        width: '100vw',
        height: '300vh'
      }}>
        <SocialHeader />
        <center><h1 className="text-xl font-bold mb-4">Simon Says Game</h1></center>

        {!gameStarted ? (
          currentLevel === null ? (
            <div>
              <center><h2>Select a Level</h2></center>
              {[1, 2, 3].map((level) => (
                <button
                  style={buttonStyle}
                  key={level}
                  onClick={() => startLevel(level)}
                >
                  Level {level}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <center><h2>Level {currentLevel} Selected</h2></center>
              <button
                style={buttonStyle}
                onClick={startGame}
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
              <p className="text-lg mb-4">{currentCommand.text}</p>
            </center>
            <div className="flex space-x-4">
              <button
                style={buttonStyle2}
                onClick={() => handleResponse(true)}
              >
                Child Did ✅
              </button>
              <button
                style={buttonStyle1}
                onClick={() => handleResponse(false)}
              >
                Child Didn't ❌
              </button>
            </div>
            <center><p>Score: {score} | Attempts: {attempts}/{levels[currentLevel].length}</p></center>
          </>
        )}
      </div>
      {showModal && (
        <Modal
          finalScore={finalScore}
          onClose={() => {
            setShowModal(false);
            resetGame();
          }}
        />
      )}
    </>
  );
}