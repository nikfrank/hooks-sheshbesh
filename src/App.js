import React, { useCallback, useReducer, useMemo } from 'react';
import './App.scss';

import Game from './Game';
import { initBoard } from './util';

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

const gameReducers = {
  selectChip: (state, action)=> ({ ...state, selectedChip: action.payload }),
  unselectChip: state=> ({ ...state, selectedChip: null }),
  setDice: (state, action)=> ({ ...state, dice: action.payload }),
  makeMove: (state, action)=> ({
    ...state,
    
  }),
};

const gameReducer = (state, action)=> (gameReducers[action.type] || (i=> i))(state, action);

const actions = dispatch=> Object
  .keys(gameReducers)
  .reduce((rr, type)=> ({ ...rr, [type]: payload=> dispatch({ type, payload }) }), {});

const App = ()=> {
  const [game, setGame] = useReducer(gameReducer, initGame);

  const { selectChip, unselectChip, setDice, makeMove } = useMemo(()=> actions(setGame), [setGame]);

  const roll = useCallback(()=> (
    game.dice.length || (game.turn !== 'black')?
    null :
    setDice(randomDice())
  ), [game.dice.length, game.turn, setDice]);

  useMemo(()=> console.log(game), [game]);
  
  return (
    <div className="App">
      <Game
        selectChip={selectChip}
        unselectChip={unselectChip}
        makeMove={makeMove}
        roll={roll}
        {...game}
      />
    </div>
  );
};

export default App;
