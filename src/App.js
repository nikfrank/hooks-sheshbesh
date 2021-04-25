import React, { useState, useCallback } from 'react';
import './App.scss';

import Board from './Board';
import Dice from './Dice';

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

  turn: 'black',
  dice: [],
  selectedChip: null,
};

const randomDice = ()=> {
  const dice = [ Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];

  return ( dice[0] !== dice[1] ) ? dice : [...dice, ...dice];
};


const App = ()=> {
  const [game, setGame] = useState(initGame);

  const roll = useCallback(()=> (
    game.dice.length || (game.turn !== 'black')?
    null :
    setGame(prev=> ({ ...prev, dice: randomDice() }))
  ), [game.dice.length, game.turn]);
    
  
  return (
    <div className="App">
      <div className='game-container'>
        <Board
          onClick={i=> console.log(i, 'clicked')}
          onDoubleClick={i=> console.log(i, 'dblclicked')}
          {...game}
        />

        <div className='dice-container'>
          {!game.dice.length ? (
            <button onClick={roll}>roll</button>
          ) : (
            <Dice dice={game.dice} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
