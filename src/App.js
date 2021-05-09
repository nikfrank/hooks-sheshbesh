import React, { useCallback, useReducer, useMemo } from 'react';
import './App.scss';

import Game from './Game';
import { initBoard, calculateBoardAfterMove, otherTurn } from './util';

const initGame = {
  chips: [...initBoard],
  whiteHome: 0,
  whiteJail: 0,
  blackHome: 0,
  blackJail: 0,

  turn: null,
  dice: [],
  selectedChip: null,
  legalMoves: [],
};

const randomDice = ()=> {
  const dice = [ Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];

  return ( dice[0] !== dice[1] ) ? dice : [...dice, ...dice];
};

const differentDice = ()=>{
  let dice = [];
  while(!dice.length || (dice[0] === dice[1])) dice = randomDice();
  return dice;
};

const gameReducers = {
  startGame: (state, {payload: dice}={})=> ({ ...state, dice: dice, turn: dice[0] > dice[1] ? 'black' : 'white' }),
  selectChip: (state, action)=> ({ ...state, selectedChip: action.payload }),
  setDice: (state, action)=> ({ ...state, dice: action.payload }),
  makeMove: (state, { payload: move })=> ({
    ...state,
    ...calculateBoardAfterMove(state, move),
    selectedChip: null,
  }),
  endTurn: state => ({ ...state, turn: otherTurn[state.turn], dice: [] }),
  restartGame: () => initGame,
};

const gameReducer = (state, action)=> (gameReducers[action.type] || (i=> i))(state, action);

const actions = dispatch=> Object
  .keys(gameReducers)
  .reduce((rr, type)=> ({ ...rr, [type]: payload=> dispatch({ type, payload }) }), {});

const App = ()=> {
  const [game, setGame] = useReducer(gameReducer, initGame);

  const { selectChip, setDice, makeMove, endTurn, startGame, restartGame } = useMemo(()=> actions(setGame), [setGame]);
  
  const roll = useCallback(()=> (
    game.turn ?
    game.dice.length ? //|| (game.turn !== 'black')?
    null :
    setDice(randomDice()) :
    startGame(differentDice())
  ), [game.dice.length, game.turn, setDice]);

  return (
    <div className="App">
      <Game
        selectChip={selectChip}
        unselectChip={()=> selectChip(null)}
        makeMove={makeMove}
        endTurn={endTurn}
        roll={roll}
        endGame={restartGame}
        {...game}
      />
    </div>
  );
};

export default App;
