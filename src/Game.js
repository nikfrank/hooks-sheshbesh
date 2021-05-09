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
  endTurn,
  endGame,
})=> {

  const legalMoves = useMemo(()=> calculateLegalMoves({
    dice,
    turn,
    chips,
    blackJail,
    whiteJail,
    blackHome,
    whiteHome,
  }), [
    dice,
    turn,
    chips,
    blackJail,
    whiteJail,
    blackHome,
    whiteHome,
  ]);

  const legalMovesForSelectedChip = useMemo(()=> (
    legalMoves.filter(move=> (selectedChip === null) || move.moveFrom === selectedChip)
  ), [
    legalMoves,
    selectedChip,
  ]);

  useEffect(()=> dice.length && !legalMoves.length ? setTimeout(endTurn, dice.length * 1000) : null, [legalMoves, dice]);

  useEffect(()=> Math.max(whiteHome, blackHome) === 15 ? endGame() : null, [whiteHome, blackHome, endGame]);
  
  const chipClicked = useCallback((clicked)=>{
    // if no dice, do nothing (wait for roll)
    if( !dice.length ) return;
    const moveIfLegal = legalMovesForSelectedChip.find(move=> move.moveTo === clicked);
    
    // if turn is in jail
    if( (turn === 'black' && blackJail) || (turn === 'white' && whiteJail) ){
      // if click is on valid move, makeMove(clicked) (return)
      if( moveIfLegal ) makeMove(moveIfLegal);
      
    } else {
      if( selectedChip === null ) {
        if (
          (
            (turn === 'black' && chips[clicked] > 0 ) ||
            (turn === 'white' && chips[clicked] < 0 )
          ) &&
          legalMoves.find(move => move.moveFrom === clicked)
        ) selectChip(clicked);
        
      } else {
        // else this is a second click
        // if the space selected is a valid move, makeMove(clicked)
        if( moveIfLegal ) makeMove(moveIfLegal);

        // if another click on the selectedChip, unselect the chip
        else if( clicked === selectedChip ) unselectChip();
      }
    }
  }, [
    chips,
    makeMove,
    
    dice,
    selectedChip,
    blackJail,
    whiteJail,
    turn,
    selectChip,
    unselectChip,

    legalMovesForSelectedChip,
  ]);

  const chipDoubleClicked = useCallback((clicked)=>{
    if( !dice.length ) return;
    const moveIfLegal = legalMoves.find(move=> move.moveFrom === clicked && move.moveTo.includes?.('Home'));

    if( moveIfLegal ) makeMove(moveIfLegal);
    
  }, [dice, legalMoves]);
  
  return (
    <div className='game-container'>
      <Board
        onClick={chipClicked}
        onDoubleClick={chipDoubleClicked}
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
          <Dice dice={dice} turn={turn} />
        )}
      </div>
    </div>
  );
};

export default Game;
