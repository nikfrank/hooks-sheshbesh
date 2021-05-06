import React, { useCallback, useMemo, useEffect } from 'react';

import { calculateLegalMoves } from './util';

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

  makeMove,
})=> {

  const legalMoves = useMemo(()=> calculateLegalMoves({
    dice,
    turn,
    chips,
    blackJail,
    whiteJail,
    blackHome,
    whiteHome,
  }).filter(move=> (selectedChip === null) || move.moveFrom === selectedChip), [
    selectedChip,
    dice,
    turn,
    chips,
    blackJail,
    whiteJail,
    blackHome,
    whiteHome,
  ]);

  useEffect(()=> console.log(legalMoves), [legalMoves]);
  
  const chipClicked = useCallback((clicked)=>{
    // if no dice, do nothing (wait for roll)
    if( !dice.length ) return;

    // if turn is in jail
    if( (turn === 'black' && blackJail) || (turn === 'white' && whiteJail) ){
      // if click is on valid move, makeMove(clicked) (return)
      
    } else {
      if( selectedChip === null ) {
        if (
          (turn === 'black' && chips[clicked] > 0 ) ||
          (turn === 'white' && chips[clicked] < 0 )
        ) selectChip(clicked);
        
      } else {
        // else this is a second click
        // if the space selected is a valid move, makeMove(clicked)
        const moveIfLegal = legalMoves.find(move=> move.moveTo === clicked);
        console.log(moveIfLegal);
        if( moveIfLegal ) makeMove(moveIfLegal);
        

        // if another click on the selectedChip, unselect the chip
        if( clicked === selectedChip ) unselectChip();
      }
    }
  }, [
    dice,
    selectedChip,
    blackJail,
    whiteJail,
    turn,
    selectChip,
    unselectChip,

    legalMoves,
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
          selectedChip,
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
