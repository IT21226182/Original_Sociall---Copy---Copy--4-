import React, { useState, useEffect } from "react";
import simonTalking from "./images/simon.gif";
import simonTouchNose from "./images/hi.gif";
import simonWave from "./images/simon4.gif";
import simonSpin from "./images/simon5.gif";
import simonSad from "./images/simon4.gif";
import goodJobImage from "./images/simon4.gif";
import goodJobSound from "./images/clap.wav";

const commands = [
  { text: "Simon says say hello to bunny", valid: true, actionImage: simonTouchNose },
  { text: "Jump three times", valid: false, actionImage: simonSad },
  { text: "Simon says wave at bunny", valid: true, actionImage: simonWave },
  { text: "Clap your hands", valid: false, actionImage: simonSad },
  { text: "Simon says say thank you to bunny", valid: true, actionImage: simonSpin }
];

export default function SimonSaysGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showActionImage, setShowActionImage] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [finalScore, setFinalScore] = useState(null);
  const [showGoodJob, setShowGoodJob] = useState(false);

  const speakCommand = () => {
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = speakCommand;
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(commands[currentIndex].text);
    utterance.voice = voices.find((voice) => voice.name.includes("Male")) || voices[0];
    
    setIsSpeaking(true);
    setShowActionImage(false);
    setShowGoodJob(false);
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setShowActionImage(true);
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

    const isValid = commands[currentIndex].valid;
    if (isCorrect === isValid) {
      setScore(prevScore => prevScore + 1);
      setActionStatus("correct");
      setShowGoodJob(true);
      const audio = new Audio(goodJobSound);
      audio.play();
    } else {
      setActionStatus("incorrect");
    }

    setAttempts(prevAttempts => prevAttempts + 1);
    setTimeout(moveToNextCommand, 2000);
  };

  const moveToNextCommand = () => {
    if (attempts + 1 >= commands.length) {
      const finalScorePercentage = Math.round((score / commands.length) * 100);
      setFinalScore(finalScorePercentage);
      alert(`Game Over! Final Score: ${finalScorePercentage}%`);
      resetGame();
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % commands.length);
      setActionStatus("");
      setShowActionImage(false);
      setShowGoodJob(false);
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
  };

  const getImageForAction = () => {
    if (isSpeaking) {
      return simonTalking;
    } else if (showGoodJob) {
      return goodJobImage;
    } else if (actionStatus === "incorrect") {
      return simonSad;
    }
    return commands[currentIndex].actionImage;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">Simon Says Game</h1>

        {!gameStarted ? (
          <button
            onClick={() => setGameStarted(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 text-lg"
          >
            Start Game 🎮
          </button>
        ) : (
          <>
            <img
              src={getImageForAction()}
              alt="Simon Character"
              className="w-32 h-32 mx-auto mb-4 transition-all duration-300"
            />
            <p className="text-lg mb-4">{commands[currentIndex].text}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleResponse(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
              >
                Child Did ✅
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Child Didnt ❌
              </button>
            </div>
            <p className="mt-4 text-gray-700">Score: {score} | Attempts: {attempts}/{commands.length}</p>
          </>
        )}

        {finalScore !== null && (
          <p className="mt-4 text-lg font-bold text-purple-700">
            Final Score: {finalScore}%
          </p>
        )}
      </div>
    </div>
  );
}
