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


  const chipClicked = useCallback((clicked)=>{
    // if no dice, do nothing (wait for roll)
    if( !game.dice.length ) return;

    // if turn is in jail
    if( game[ game.turn + 'Jail' ] ){
      // if click is on valid move, makeMove(clicked) (return)
      
    } else {
      // if no chip selected
      if( game.selectedChip === null ){
        // if click is on turn's chips with legal moves, select that chip (return)
        setGame(pg=> ({ ...pg, selectedChip: clicked }) );
        
      } else {
        // else this is a second click
        // if the space selected is a valid move, makeMove(clicked)

        // if another click on the selectedChip, unselect the chip
        if( clicked === game.selectedChip )
          setGame(pg=> ({ ...pg, selectedChip: null }) );
      }
    }
  }, [game]);

  
  return (
    <div className="App">
      <div className='game-container'>
        <Board
          onClick={chipClicked}
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
