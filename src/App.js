import React, { useState } from 'react';
import './App.scss';

import Board from './Board';

const initBoard = [
  2, 0, 0, 0, 0, -5,
  0, -3, 0, 0, 0, 5,
  -5, 0, 0, 0, 3, 0,
  5, 0, 0, 0, 0, -2,
];

const initGame = {
  chips: [...initBoard],
  whiteHome: 0,
  whiteJail: 0,
  blackHome: 0,
  blackJail: 0,
};


const App = ()=> {
  const [game, setGame] = useState(initGame);
  
  return (
    <div className="App">
      <div className='game-container'>
        <Board {...game} />
      </div>
    </div>
  );
};

export default App;
