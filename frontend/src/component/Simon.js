import React, { useState, useEffect } from "react";
import simonTalking from "./images/simon.gif"; // Simon talking
import simonTouchNose from "./images/simon5.gif"; // Simon touching nose
import simonWave from "./images/simon4.gif"; // Simon waving
import simonSpin from "./images/simon5.gif"; // Simon spinning
import simonSad from "./images/simon4.gif"; // Simon sad for incorrect actions
import goodJobImage from "./images/a.png"; // Good job image
import goodJobSound from "./images/goodjob.mp3"; // Good job sound

const commands = [
  { text: "Simon says touch your nose", valid: true, actionImage: simonTouchNose },
  { text: "Jump three times", valid: false, actionImage: simonSad },
  { text: "Simon says wave at mom", valid: true, actionImage: simonWave },
  { text: "Clap your hands", valid: false, actionImage: simonSad },
  { text: "Simon says spin around", valid: true, actionImage: simonSpin }
];

export default function SimonSaysGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showActionImage, setShowActionImage] = useState(false);
  const [actionStatus, setActionStatus] = useState(""); // Track correct or incorrect action
  const [finalScore, setFinalScore] = useState(null); // Save final score

  const speakCommand = () => {
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = speakCommand;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(commands[currentIndex].text);
    utterance.voice = voices.find((voice) => voice.name.includes("Male")) || voices[0];

    utterance.onstart = () => {
      setIsSpeaking(true);
      setShowActionImage(false); // Hide action image while speaking
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setShowActionImage(true); // Show action image after speaking
    };

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (gameStarted) {
      speakCommand();
    }
  }, [currentIndex, gameStarted]);

  const handleResponse = (isCorrect) => {
    if (!gameStarted) return; // Prevent clicks before starting

    const isValid = commands[currentIndex].valid;
    if (isCorrect === isValid) {
      setScore(score + 1);
      setActionStatus("correct");

      // Play "Good Job" sound
      const audio = new Audio(goodJobSound);
      audio.play();

      // Delay for 3 seconds before moving to the next command
      setTimeout(() => {
        moveToNextCommand();
      }, 3000);
    } else {
      setActionStatus("incorrect");
      moveToNextCommand(); // No delay for incorrect responses
    }

    setAttempts(attempts + 1);
  };

  const moveToNextCommand = () => {
    if (attempts + 1 >= 5) {
      const finalScorePercentage = (score / 5) * 100;
      setFinalScore(finalScorePercentage);
      alert(`Game Over! Final Score: ${finalScorePercentage}%`);
      resetGame();
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % commands.length);
      setActionStatus(""); // Reset action status
      setShowActionImage(false); // Hide image for new command until speech ends
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
  };

  const getImageForAction = () => {
    if (isSpeaking) {
      return simonTalking; // Show talking GIF while speaking
    } else if (actionStatus === "correct") {
      return goodJobImage; // Show "Good Job" image when correct
    } else if (actionStatus === "incorrect") {
      return simonSad; // Show sad GIF when incorrect
    }
    return commands[currentIndex].actionImage; // Default action image
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
            {/* Show talking GIF when speaking, then action image after speaking */}
            <img
              src={showActionImage ? getImageForAction() : simonTalking}
              alt="Simon Character"
              className="w-32 h-32 mx-auto mb-4 transition-all duration-300"
            />

            <p className="text-lg mb-4">{commands[currentIndex].text}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleResponse(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
              >
                Correct ✅
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Incorrect ❌
              </button>
            </div>
            <p className="mt-4 text-gray-700">Score: {score} | Attempts: {attempts}/5</p>
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
