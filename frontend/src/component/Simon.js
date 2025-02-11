import React, { useState, useEffect } from "react";
import simonTalking from "./images/simon.gif";
import simonTouchNose from "./images/hi.gif";
import simonWave from "./images/simon4.gif";
import simonSpin from "./images/simon5.gif";
import simonSad from "./images/simon4.gif";
import goodJobImage from "./images/simon4.gif";
import goodJobSound from "./images/aw.mp3";

const levels = {
  1: [
    { text: "Simon says, say hello", valid: true, actionImage: simonTouchNose },
    { text: "Jump three times", valid: false, actionImage: simonSad },
    { text: "Simon says give a comforting hug!", valid: true, actionImage: simonWave },
  ],
  2: [
    { text: "Clap your hands", valid: false, actionImage: simonSad },
    { text: "Simon says, Show me a happy face!", valid: true, actionImage: simonSpin },
    { text: "Simon says, Look at my eyes", valid: true, actionImage: simonSpin },
  ],
  3: [
    { text: "Simon says, Give a high-five", valid: true, actionImage: simonSpin },
    { text: "Simon says, Say 'thank you' with a smile", valid: true, actionImage: simonSpin },
    { text: "Simon says, Raise your hand and wait!", valid: true, actionImage: simonSpin },
    { text: "Simon says, Say 'I like your drawing!' to a mom!", valid: true, actionImage: simonSpin },
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

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }, 100); // Small delay to ensure state updates first
  };

  useEffect(() => {
    if (gameStarted) {
      speakCommand();
    }
  }, [currentIndex, gameStarted]);

  const handleResponse = (isCorrect) => {
    if (!gameStarted) return;

    const isValid = currentCommand.valid;
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
    if (currentIndex + 1 >= levels[currentLevel].length) {
        // Correct score percentage calculation
        const finalScorePercentage = attempts > 0 ? Math.round((score / levels[currentLevel].length) * 100) : 0;
        setFinalScore(finalScorePercentage);
        alert(`Level ${currentLevel} Complete! Score: ${finalScorePercentage}%`);
        resetGame();
    } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
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
    setCurrentLevel(null);
  };

  const startLevel = (level) => {
    setCurrentLevel(level);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);   // Reset score for new level
    setAttempts(0); // Reset attempts for new level
    setCurrentIndex(0);
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
    return currentCommand.actionImage || simonTalking;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">Simon Says Game</h1>

        {!gameStarted ? (
          currentLevel === null ? (
            <div>
              <h2 className="text-lg mb-4">Select Level</h2>
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => startLevel(level)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl m-2 hover:bg-blue-600"
                >
                  Level {level}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="text-lg mb-4">Level {currentLevel} Selected</h2>
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-4 py-2 rounded-xl m-2 hover:bg-green-600"
              >
                Start Game
              </button>
            </div>
          )
        ) : (
          <>
            <img
              src={getImageForAction()}
              alt="Simon Character"
              className="w-32 h-32 mx-auto mb-4 transition-all duration-300"
            />
            <p className="text-lg mb-4">{currentCommand.text}</p>
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
                Child Didn't ❌
              </button>
            </div>
            <p className="mt-4 text-gray-700">Score: {score} | Attempts: {attempts}/{levels[currentLevel].length}</p>
          </>
        )}
      </div>
    </div>
  );
}
