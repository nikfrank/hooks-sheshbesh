import React, { useCallback } from 'react';

import Board from './Board';
import Dice from './Dice';


const Game = ({
  selectChip,
  unselectChip,

  selectedChip,
  
  roll,
  dice,
  
  turn,
  chips,
  
  blackJail,
  whiteJail,
  blackHome,
  whiteHome,
})=> {

  const chipClicked = useCallback((clicked)=>{
    // if no dice, do nothing (wait for roll)
    if( !dice.length ) return;

    // if turn is in jail
    if( (turn === 'black' && blackJail) || (turn === 'white' && whiteJail) ){
      // if click is on valid move, makeMove(clicked) (return)
      
    } else {
      // if no chip selected
      if( selectedChip === null ){
        // if click is on turn's chips with legal moves, select that chip (return)
        selectChip(clicked);
        
      } else {
        // else this is a second click
        // if the space selected is a valid move, makeMove(clicked)

        // if another click on the selectedChip, unselect the chip
        if( clicked === selectedChip )
          unselectChip();
      }
    }
  }, [
    dice,
    selectedChip,
    blackJail,
    whiteJail,
    turn,
    selectChip,
    unselectChip
  ]);
  
  return (
    <div className='game-container'>
      <Board
        onClick={chipClicked}
        onDoubleClick={i=> console.log(i, 'dblclicked')}
        {...{
          whiteHome,
          blackHome,
          whiteJail,
          blackJail,
          chips,
        }}
      />

      <div className='dice-container'>
        {!dice.length ? (
          <button onClick={roll}>roll</button>
        ) : (
          <Dice dice={dice} />
        )}
      </div>
    </div>
  );
};

export default Game;
