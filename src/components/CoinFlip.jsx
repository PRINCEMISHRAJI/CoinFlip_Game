import React, { useState, useEffect } from 'react';
// import './CoinFlip.css'; // Import the CSS file with the coin animation

const CoinFlip = ({ result }) => {
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (result) {
      setFlipping(true);
      setTimeout(() => {
        setFlipping(false);
      }, 1000); // Duration of animation
    }
  }, [result]);

  return (
    <div>
      <div className={`coin ${flipping ? 'flipping' : ''}`}>
        <div className="coin-face head " style={{ transform: result === 'heads' ? 'rotateY(0deg)' : 'rotateY(180deg)' }}>Heads</div>
        <div className="coin-face tail" style={{ transform: result === 'tails' ? 'rotateY(0deg)' : 'rotateY(180deg)' }}>Tails</div>
      </div>
      {result && <p>Result: {result.charAt(0).toUpperCase() + result.slice(1)}</p>}
    </div>
  );
};

export default CoinFlip;
