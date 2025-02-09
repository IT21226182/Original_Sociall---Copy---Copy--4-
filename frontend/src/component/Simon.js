import React, { useState, useEffect } from 'react';

// Adding styles directly inside the JavaScript file
const styles = {
  app: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  simonContainer: {
    margin: '20px',
  },
  simon: {
    width: '100px',
    height: '200px',
    margin: 'auto',
    borderRadius: '20px',
    position: 'relative',
  },
  simonHead: {
    width: '60px',
    height: '60px',
    backgroundColor: '#f0c400',
    borderRadius: '50%',
    margin: '20px auto',
  },
  simonBody: {
    width: '80px',
    height: '120px',
    backgroundColor: '#f0c400',
    margin: 'auto',
    borderRadius: '10px',
  },
  simonArms: {
    width: '20px',
    height: '80px',
    backgroundColor: '#f0c400',
    position: 'absolute',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'space-between',
    animation: 'wave 2s infinite',
  },
  simonLegs: {
    width: '100px',
    height: '20px',
    backgroundColor: '#f0c400',
    position: 'absolute',
    bottom: '10px',
    margin: 'auto',
    left: '0',
    right: '0',
    borderRadius: '10px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  buttonFocus: {
    outline: 'none',
  },
  gameOverText: {
    fontSize: '20px',
    color: 'red',
    marginTop: '20px',
  },
  scoreText: {
    fontSize: '20px',
    marginTop: '20px',
  },
  instruction: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '20px',
    opacity: 0,
    animation: 'fadeIn 2s forwards',
  },
};

// Keyframes for the wave animation (simulating a movement)
const waveKeyframes = `
@keyframes wave {
  0% { transform: translateX(-50%) rotate(0deg); }
  50% { transform: translateX(-50%) rotate(15deg); }
  100% { transform: translateX(-50%) rotate(0deg); }
}
`;

// Keyframes for the fade-in animation of instructions
const fadeInKeyframes = `
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;

function App() {
  const [simonSays, setSimonSays] = useState('');
  const [instruction, setInstruction] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const instructions = [
    'Simon says touch your nose.',
    'Simon says jump up and down.',
    'Simon says clap your hands.',
    'Touch your head.',
    'Simon says spin around.',
    'Sit down.',
  ];

  const simonSayInstructions = [
    'Simon says touch your nose.',
    'Simon says jump up and down.',
    'Simon says clap your hands.',
    'Simon says spin around.',
  ];

  const noSimonInstructions = ['Touch your head.', 'Sit down.'];

  const randomInstruction = () => {
    const randomIndex = Math.floor(Math.random() * instructions.length);
    const instruction = instructions[randomIndex];
    setInstruction(instruction);
    const isSimonSays = simonSayInstructions.includes(instruction);
    setSimonSays(isSimonSays ? 'Simon says' : '');
  };

  const handleClickCorrect = () => {
    if (simonSays && attempts < 3 && instruction.startsWith('Simon says')) {
      setScore(score + 1);
      alert('Correct!');
      nextInstruction();
    } else {
      alert('Wrong! Try again.');
      setAttempts(attempts + 1);
    }
  };

  const handleClickWrong = () => {
    if (!simonSays && attempts < 3) {
      setScore(score + 1);
      alert('Correct! You should not have done the action.');
      nextInstruction();
    } else {
      alert('Wrong! Try again.');
      setAttempts(attempts + 1);
    }
  };

  const handleTryAgain = () => {
    setAttempts(0);
    // Keep the same instruction when try again is clicked
    randomInstruction();
  };

  const nextInstruction = () => {
    if (attempts < 3) {
      setAttempts(0);
      randomInstruction();
    } else {
      setGameOver(true);
    }
  };

  useEffect(() => {
    randomInstruction();
  }, []);

  useEffect(() => {
    if (instruction) {
      const speech = new SpeechSynthesisUtterance(instruction);
      speechSynthesis.speak(speech);
    }
  }, [instruction]);

  return (
    <div style={styles.app}>
      {/* Injecting the wave and fadeIn animation styles */}
      <style>{waveKeyframes}</style>
      <style>{fadeInKeyframes}</style>

      <div style={styles.simonContainer}>
        <div style={styles.simon}>
          {/* Animated man as Simon */}
          <div style={styles.simonHead}></div>
          <div style={styles.simonBody}></div>
          <div style={styles.simonArms}></div>
          <div style={styles.simonLegs}></div>
        </div>
        <h2>{simonSays ? simonSays : 'Your turn!'}</h2>
        {/* Animated instruction */}
        <p style={styles.instruction}>{instruction}</p>
      </div>
      <div style={styles.buttons}>
        <button style={styles.button} onClick={handleClickCorrect}>Correct</button>
        <button style={styles.button} onClick={handleClickWrong}>Wrong</button>
        {attempts < 3 && !gameOver && (
          <button style={styles.button} onClick={handleTryAgain}>Try Again</button>
        )}
      </div>
      {gameOver && <h3 style={styles.gameOverText}>Game Over! You've exceeded the number of attempts.</h3>}
      <div style={styles.scoreText}>Score: {score}</div>
    </div>
  );
}

export default App;
