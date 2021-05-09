# sheshbesh with react hooks

let's build our favourite dice game with the latest from react!

---

### Agenda

- [step 1: Build a 2-player local game in React using lots of SVGs](#step1)
- [step 2: Build a computer player for 1-player local game](#step2)
- [step 3: Build a game server with google oauth verification](#step3)
- [step 4: Deploy the solution to Heroku](#step4)


## Getting Started

`$ cd ~/code`

`$ npx create-react-app sheshbesh`

`$ cd sheshbesh`

`$ npm i -D node-sass@4`

`$ npm start`

you now have the default create-react-app starter running in your browser and can edit the `src` files live

you have also installed `node-sass` which will allow us to write our styles as `.scss` (not just `.css`)


<a name="step1"></a>
## step 1: Build a 2-player local game in React using lots of SVGs

### scaffolding the board

We'll use [SVG in React](https://blog.lftechnology.com/using-svg-icons-components-in-react-44fbe8e5f91) to build our board

`$ touch src/Board.js`

<sub>./src/Board.js</sub>
```js
import React from 'react';

const Board = ()=> (
  <svg viewBox='0 0 1500 1000' className='Board'>
  </svg>
);

export default Board;
```


<sub>./src/App.js</sub>
```js
import React from 'react';
import './App.scss';

import Board from './Board';

const App = ()=> {
  return (
    <div className="App">
      <div className='game-container'>
        <Board />
      </div>
    </div>
  );
};

export default App;
```

### drawing an empty board

now let's draw the outline of our board with [svg rectangles](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect)


```js
import React from 'react';

const Board = ()=> (
  <svg viewBox='0 0 1500 1000' className='Board'>
      <rect x={0} y={0}
          height={1000} width={1500}
          fill='#fe9'
    />
    <rect x={0} y={0}
          height={1000} width={20}
          fill='#731'
    />
    <rect x={0} y={0}
          height={20} width={1500}
          fill='#731'
    />
    <rect x={0} y={980}
          height={20} width={1500}
          fill='#731'
    />
    <rect x={1400} y={0}
          height={1000} width={100}
          fill='#731'
    />
    <rect x={1410} y={20}
          height={960} width={80}
          fill='#510'
    />
    <rect x={660} y={0}
          height={1000} width={100}
          fill='#731'
    />
  </svg>
);

export default Board;
```


now we can go ahead and draw some triangles, using [svg polygon](https://www.w3schools.com/graphics/svg_polygon.asp)


<sub>./src/Board.js</sub>
```js
//...

    {[0, 180].map(angle=> (
      <g key={angle} style={{ transform: 'rotate('+angle+'deg)', transformOrigin:'47.33% 50%' }}>
        <polygon points='25,20 125,20 75,450' className='white-triangle' />
        <polygon points='131,20 231,20 181,450' className='black-triangle' />
        <polygon points='237,20 337,20 287,450' className='white-triangle' />
        <polygon points='343,20 443,20 393,450' className='black-triangle' />
        <polygon points='449,20 549,20 499,450' className='white-triangle' />
        <polygon points='555,20 655,20 605,450' className='black-triangle' />

        <polygon points='765,20 865,20 815,450' className='white-triangle' />
        <polygon points='871,20 971,20 921,450' className='black-triangle' />
        <polygon points='977,20 1077,20 1027,450' className='white-triangle' />
        <polygon points='1083,20 1183,20 1133,450' className='black-triangle' />
        <polygon points='1189,20 1289,20 1239,450' className='white-triangle' />
        <polygon points='1295,20 1395,20 1345,450' className='black-triangle' />
      </g>
    ))}


//...
```

47.33% is of course the center of our board (half of 1400 / 1500 = 7/15 = 0.4733333333)

which is where we want to rotate the triangles about in order to de-duplicate the code


before writing any styles, we'll change the extension from .css to .scss

`$ mv src/App.css src/App.scss`

<sub>./src/App.js</sub>
```js
//...

import './App.scss';

//...
```

at which point we will probably have to terminate and reinitiate our dev server (aka `npm start`)

now we can position the `Board` and colour our triangles

<sub>./src/App.scss</sub>
```scss
.Board {
  height: 100vh;
  width: auto;
  max-height: 100vh;
  max-width: 100vw;
}

.white-triangle {
  stroke: black;
  fill: white;
}

.black-triangle {
  stroke: black;
  fill: black;
}
```

next, we can refactor the triangles even further


<sub>./src/Board.js</sub>
```js
//...

const centers = [
  1345, 1239, 1133, 1027, 921, 815, 605, 499, 393, 287, 181, 75,
];


//...


    {[0, 180].map(angle=> (
      <g key={angle} style={{ transform: 'rotate('+angle+'deg)', transformOrigin:'47.33% 50%' }}>
        {[...Array(12)].map((_, i)=>(
           <polygon key={i}
                    points={`${centers[i]-50},20 ${centers[i]+50},20 ${centers[i]},450`}
                    className={(i%2 ? 'black' : 'white')+'-triangle'} />
        ))}
      </g>
    ))}


```

our board looks great, now it needs pieces



### drawing pieces on the board

let's start up in our App by declaring a reactive variable with `useState` with the initial state of a sheshbesh game


<sub>./src/App.js</sub>
```js
//...

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

//...
```

what we'll find convenient is to keep track of the occupants of a space on the board using (+) positive numbers to represent black pieces (and how many), with (-) negative numbers representing white pieces (and how many)

of course, we'll need to also keep track of the pieces which are off the board (home / jail) at any given time for each player


now of course we can read the values as `props` inside the `Board` Component, and render some more SVG elements for them


<sub>./src/Board.js</sub>
```js
//...

const Board = ({
  whiteHome,
  blackHome,
  whiteJail,
  blackJail,
  chips,
})=> (
  //...

    {
      chips.map((chip, i)=> (
        <g key={i}>
          {[...Array(Math.abs(chip))].map((_, c)=> (
            <circle key={c} cx={centers[Math.min( i, 2*centers.length - i - 1 )]}
                    cy={ i < 12 ? (60 + 60*c) : (940 - 60*c) } r={30}
                    className={chip < 0 ? 'white-chip' : 'black-chip'}/>
          ))}

        </g>
      ))
    }


);

//...
```


notice of course that the pieces are radius 30 and we add 60 for each piece (`60*c`)

this will cause the pieces to line up one atop the other



<sub>./src/App.scss</sub>
```scss
//...

circle.white-chip {
  fill: white;
  stroke: #0aa;
  stroke-width: 10px;
}

circle.black-chip {
  fill: black;
  stroke: brown;
  stroke-width: 10px;
}
```

notice here the stroke overlaps from one piece to the next, which I like from a style point of view.

---


this is great until we have too many chips on the board!

if we test out what'd happen if we had 9 pieces on one chip

<sub>./src/App.js<sub>
```js
//...

const initBoard = [
  2, 0, 0, 0, 0, -9,
  0, -3, 0, 0, 0, 5,
  -5, 0, 0, 0, 3, 0,
  5, 0, 0, 0, 0, -2,
];

//...
```


we'll see that the chips go waaaaay over center

so we need a solution that causes the pieces to overlap when there's more than 6 of them


what we'll do is:

 - when there's 6 or fewer pieces, continue multiplying by 60
 - when there's more than 6 pieces, we'll reduce the multiplicand (60) by a bit for every extra piece
 

<sub>./src/Board.js</sub>
```js
//...

    {
      chips.map((chip, i)=> (
        <g key={i}>
          {[...Array(Math.abs(chip))].map((_, c)=> (
            <circle key={c} cx={centers[i]}
                    cy={ i < 12 ? (
                        60 + (60 - 5*Math.max(0, Math.abs(chip)-6))*c
                    ) : (
                        940 - (60 - 5*Math.max(0, Math.abs(chip)-6))*c
                    ) } r={30}
                    className={chip < 0 ? 'white-chip' : 'black-chip'}/>
          ))}
        </g>
      ))
    }


//...
```

now we can try this out with different numbers of pieces (only needs to work up to 15 of course) by editing the hardcoded initial board state


just remember to put it back eventually!



### clicking the pieces

our users will want to make moves and play the game, and have a comfortable time doing so

to make things easy, let's make some invisible rectangles above each of the spaces on the board for them to click

we'll collect single and double click events (we'll use the double clicks to move a piece home when that's allowed)

these rectangles will help us avoid problems where the click event could hit the triangle, circle or background

<sub>./src/Board.js</sub>
```js
//...

const Board = ({
  whiteHome,
  blackHome,
  whiteJail,
  blackJail,
  chips,
  onClick = ()=> 0,
  onDoubleClick = ()=> 0,
})=> (
  //...

    {
      chips.map((chip, i)=> (
        <g key={i}>
          {[...Array(Math.abs(chip))].map((_, c)=> (
            <circle key={c} cx={centers[Math.min( i, 2*centers.length - i - 1 )]}
                    cy={ i < 12 ? (
                      60 + (60 - 5*Math.max(0, Math.abs(chip)-6))*c
                    ) : (
                      940 - (60 - 5*Math.max(0, Math.abs(chip)-6))*c
                    ) } r={30}
                    className={chip < 0 ? 'white-chip' : 'black-chip'}/>
          ))}

          <rect x={centers[Math.min( i, 2*centers.length - i - 1 )] - 50}
                width={100}
                y={ i < 12 ? 20 : 550 } height={430}
                fill='transparent' stroke='transparent'
                onDoubleClick={()=> onDoubleClick(i)}
                onClick={()=> onClick(i)} />

        </g>
      ))
    }

//...
```

for now we'll just log out the index of the space that's been clicked

later, we'll use these event handler callbacks to trigger real state mutations!

<sub>./src/App.js</sub>
```js

//...

const App = ()=> {
  const [game, setGame] = useState(initGame);
  
  return (
    <div className="App">
      <div className='game-container'>
        <Board
          onClick={i=> console.log(i, 'clicked')}
          onDoubleClick={i=> console.log(i, 'dblclicked')}
          {...game}
        />
      </div>
    </div>
  );
};


//...
```


### jail and home

once we get our game running, we'll end up with pieces in jail or home. Let's render them now so we're ready for that later.

<sub>./src/App.js</sub>
```js
//...

const initGame = {
  chips: [...initBoard],
  whiteHome: 15,
  whiteJail: 5,
  blackHome: 15,
  blackJail: 5,
};

//...
```

these are the maximum values for home or jail we need to account for

(of course it's possible to have more than 5 in jail, if you've taught your younger brother all the rules wrong and he keeps leaving all of his pieces vulnerable!)

remember in the last step we already passed `whiteHome`, `whiteJail`, `blackHome`, `blackJail` as part of our props shmeer `{...game}` to our `Board` Component


<sub>./src/Board.js</sub>
```js
//...

    {
      [...Array(whiteJail)].map((_, i)=>(
        <circle key={i} cx={710}
                cy={ 60 + 60*i } r={30}
                className='white-chip'/>
      ))
    }
    {
      [...Array(blackJail)].map((_, i)=>(
        <circle key={i} cx={710}
                cy={ 940 - 60*i } r={30}
                className='black-chip'/>
      ))
    }

```

this will render the jailed pieces in the middle of the board on either side


```js
    {
      [...Array(whiteHome)].map((_, i)=> (
        <rect key={i} x={1420} y={25 + 25*i} height={20} width={60} className='white-home' />
      ))
    }
    {
      [...Array(blackHome)].map((_, i)=> (
        <rect key={i} x={1420} y={955 - 25*i} height={20} width={60} className='black-home' />
      ))
    }

//...
```

as for home, we've rendered the pieces on their sides (as rectangles... the precocious student may wish to style them with a linear gradient to appear more like the edge of a circular piece...)


we'll need some styles for those home pieces...


<sub>./src/App.scss</sub>
```scss
rect.white-home {
  fill: #0aa;
}

rect.black-home {
  fill: brown;
}
```



now that we have all the pieces rendering we can start thinking through the logic of the game



### taking turns

we'll need a few more values in our `state` to keep track of the dice and whose turn it is

<sub>./src/App.js</sub>
```js
//...

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

//...
```

we'll also keep track of whether there's a chip selected (which we'll use when we start trying to move the pieces around)

now we should give the user a way to roll the dice so we can start playing


#### rolling dice

let's make a button and position it nicely in the middle of the Board

<sub>./src/App.js</sub>
```js
//...
        <Board .../>

        <div className='dice-container'>
          {!game.dice.length ? (
             <button onClick={roll}>roll</button>
          ) : game.dice}
        </div>

//...
```

<sub>./src/App.scss</sub>
```scss
body {
  overflow: hidden;
}

.App {
  display: flex;
  justify-content: center;
}

.game-container {
  position: relative;
}

//...

.dice-container {
  position: absolute;
  height: 100px;
  top: calc( 50% - 50px );

  width: 100px;
  left: calc( 47.33% - 50px );
}
```

and our roll function `useCallback`

<sub>./src/App.js</sub>
```js

const randomDice = ()=> {
  return [ Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];
};


  //...

  const roll = useCallback(()=> (
    game.dice.length || (game.turn !== 'black')?
    null :
    setGame(prev=> ({ ...prev, dice: randomDice() }))
  ), [game.dice.length, game.turn]);

  //...
```

now we should be able to roll the dice once

we'll see that we need to do something about doubles!


<sub>./src/App.js</sub>
```js
//...

const randomDice = ()=> {
  const dice = [ Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)];

  return ( dice[0] !== dice[1] ) ? dice : [...dice, ...dice];
};

//...
```


now let's take a break from our busy lives to make a happy little component that draws dice on the screen.


`$ touch src/Dice.js`

<sub>./src/Dice.js</sub>
```js
import React from 'react';

const Dice = ({ dice })=>
  dice.map((die, i)=> (
    <svg viewBox='0 0 100 100' key={i} className='die'>
      <rect x={0} y={0} height={100} width={100} rx={12}/>

      {die === 1 ? (
         <circle cx={50} cy={50} r={10} />
      ): die === 2 ? (
         <g>
           <circle cx={33} cy={33} r={10} />
           <circle cx={67} cy={67} r={10} />
         </g>
      ): die === 3 ? (
         <g>
           <circle cx={33} cy={33} r={10} />
           <circle cx={50} cy={50} r={10} />
           <circle cx={67} cy={67} r={10} />
         </g>
      ): die === 4 ? (
        <g>
          <circle cx={33} cy={33} r={10} />
          <circle cx={33} cy={67} r={10} />
          <circle cx={67} cy={33} r={10} />
          <circle cx={67} cy={67} r={10} />
        </g>
      ): die === 5 ? (
        <g>
          <circle cx={33} cy={33} r={10} />
          <circle cx={33} cy={67} r={10} />
          <circle cx={67} cy={33} r={10} />
          <circle cx={50} cy={50} r={10} />
          <circle cx={67} cy={67} r={10} />
        </g>
      ): die === 6 ? (
        <g>
          <circle cx={33} cy={33} r={10} />
          <circle cx={33} cy={50} r={10} />
          <circle cx={33} cy={67} r={10} />
          <circle cx={67} cy={33} r={10} />
          <circle cx={67} cy={50} r={10} />
          <circle cx={67} cy={67} r={10} />
        </g>
      ): null}
    </svg>
  ));

export default Dice;
```

<sub>./src/App.js</sub>
```js
//...

import Dice from './Dice';

//...

      <div className='dice-container'>
        {!game.dice.length ? (
          <button onClick={roll}>roll</button>
        ) : (
          <Dice dice={game.dice} />
        )}
      </div>

//...

```

and of course, we'll want to make sure the dice look nice


<sub>./src/App.scss</sub>
```scss

.dice-container {
  position: absolute;
  height: 100px;
  top: calc( 50% - 50px );

  width: 100px;
  left: calc( 47.33% - 50px );

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.die {
  height: 40px;
  width: 40px;
  margin: 3px;
}

.die rect {
  fill: white;
  stroke: black;
  stroke-width: 4px;
}

.dice-container button {
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  outline: none;
  font-weight: 900;
}

//...
```



#### event logic for selecting and moving a piece

remember earlier of course we made some invisible rectangles for the user to click on

now we'll respond to the click events by selecting then moving pieces

in pseudocode

```
when the player clicks a space

 - if there are no dice, don't do anything
 - if the player is in jail, check if the space clicked is a legal move from jail
   - if so, move out of jail
   - otherwise do nothing
 - otherwise, the player isn't in jail
   - if there is no selectedChip, and this chip has legal moves, select it
   - if there is a selectedChip, and this chip can be moved to legally, move there
   - if this chip IS the selected chip, unselect it
 
```

let's make a `chipClicked` callback to put our thoughts into action

<sub>./src/App.js</sub>
```js

//...

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

//...


        <Board
          onClick={chipClicked}
          onDoubleClick={i=> console.log(i, 'dblclicked')}
          {...game}
        />

//...

```

if we put a `console.log(game, clicked);` in there, we can see that our click-selecting is working fine

however, our `App` component is getting a bit hairy, which means this is a good time to start thinking about refactoring

we're going to need to write a few functions which make updates into nested parts of our `game` state variable

(we already started using the updater-spread pattern to do this with a standard `useState` setup)

React gives us a hook which is meant for this situation, which I'd like for us to learn about here [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)

by writing our game update logic in reducers, we'll be able to maintain a more readable & testable codebase.


#### refactoring to `useReducer` and `<Game />`

first, let's change our `useState` to a `useReducer`

<sub>./src/App.js</sub>
```js
import React, { useState, useCallback, useReducer, useMemo } from 'react';

//...

const gameReducers = {
  selectChip: (state, action)=> ({ ...state, selectedChip: action.payload }),
  unselectChip: state=> ({ ...state, selectedChip: null }),
  setDice: (state, action)=> ({ ...state, dice: action.payload }),
};

const gameReducer = (state, action)=> (gameReducers[action.type] || (i=> i))(state, action);

const actions = dispatch=> Object
  .keys(gameReducers)
  .reduce((rr, type)=> ({ ...rr, [type]: payload=> dispatch({ type, payload }) }), {});


//...

  const [game, setGame] = useReducer(gameReducer, initGame);

  const { selectChip, unselectChip, setDice } = useMemo(()=> actions(setGame), [setGame]);

```


now we can change our `setGame(pg=> ({ ...pg, /* etc */ }) )` updater-spread calls to action-creator calls.

```js

  //...

  const roll = useCallback(()=> (
    game.dice.length || (game.turn !== 'black')?
    null :
    setDice(randomDice())
  ), [game.dice.length, game.turn, setDice]);


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
        selectChip(clicked);
        
      } else {
        // else this is a second click
        // if the space selected is a valid move, makeMove(clicked)

        // if another click on the selectedChip, unselect the chip
        if( clicked === game.selectedChip )
          unselectChip();
      }
    }
  }, [game, selectChip, unselectChip]);

//...
```

perhaps later we'll move some of that dice checking logic into the reducer.

meanwhile, the function calls are now a lot cleaner


---


now we can go ahead and make a `Game` component (which will allow us to spread our `game` nested state onto props)

`$ touch src/Game.js`


and move most of the logic over into it

<sub>./src/Game.js</sub>
```js
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

```

fomr the `App` component, which now is really just a place for the state and 'impure' functions to live

<sub>./src/App.js</sub>
```js
import React, { useCallback, useReducer, useMemo } from 'react';
import './App.scss';

import Game from './Game';

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

const gameReducers = {
  selectChip: (state, action)=> ({ ...state, selectedChip: action.payload }),
  unselectChip: state=> ({ ...state, selectedChip: null }),
  setDice: (state, action)=> ({ ...state, dice: action.payload }),
};

const gameReducer = (state, action)=> (gameReducers[action.type] || (i=> i))(state, action);

const actions = dispatch=> Object
  .keys(gameReducers)
  .reduce((rr, type)=> ({ ...rr, [type]: payload=> dispatch({ type, payload }) }), {});

const App = ()=> {
  const [game, setGame] = useReducer(gameReducer, initGame);

  const { selectChip, unselectChip, setDice } = useMemo(()=> actions(setGame), [setGame]);

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
        roll={roll}
        {...game}
      />
    </div>
  );
};

export default App;

```


the best reason this will be useful later, is it will make adding network play easy!

(we can have the network handlers in the `App` so the `Game` won't notice who the other player is)



#### continuing event logic

now that our chip selection is refactored to inside the `Game` component, let's continue coding it.

we should only be able to select chips for the current player

<sub>./src/Game.js</sub>
```js
//...

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
    unselectChip
  ]);

  //...

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


//...
```

and we should style the `selectedChip`'s triangle

<sub>./src/Board.js</sub>
```js
//...

const Board = ({
  whiteHome,
  blackHome,
  whiteJail,
  blackJail,
  chips,
  selectedChip,
  onClick = ()=> 0,
  onDoubleClick = ()=> 0,
})=> (

  //...

          <polygon key={i}
                   points={`${centers[i]-50},20 ${centers[i]+50},20 ${centers[i]},450`}
                   className={[
                     (i%2 ? 'black' : 'white')+'-triangle',
                     selectedChip === (i + angle / 15) ? 'selected-chip' : ''
                   ].join(' ')} />
```


<sub>./src/App.scss</sub>
```scss
//...

.black-triangle.selected-chip {
  fill: #880;
}

.white-triangle.selected-chip {
  fill: #ff0;
}

```

those triangles look great eh?

the hawk-eyed will notice that our `Game` is allowing us to select chips which have no legal moves!

now we'll need to figure out which chips have legal moves, so we can block the user from selecting anything else


#### `calculateLegalMoves`

every time the dice change, we'll want to keep in our game state a list of legal moves

(once we have that, we'll move on to `calculateBoardAfterMove`... let's not get ahead of ourselves though)


((( these are old notes, review them nik! )))

`$ touch src/util.js`


<sub>./src/util.js</sub>
```js
export const calculateLegalMoves = ({ chips, dice, turn, whiteJail, blackJail })=>{

};
```

again, I like to think through this type of problem in English, then translate to js

```
 - if there's no dice, there's no moves

 - while there are dice left, for each die...

 - if we're in jail, only spaces 0-5 (black) or 18-23 (white) can be moved to
   only if there are 1 or fewer opponent pieces (or our pieces are there)
   
 - otherwise, for every unique die, for every chip with our piece
   we can make a move to {chip + die} (black) or {chip - die} (white)
   only if there are 1 or fewer opponent pieces (or our pieces are there)
 
 - if all of our pieces are in the last 6 slots, we can move to home if
   the die is the exact distance to home OR
   the die is greater than our furthest piece and we're trying to move our furthest piece
```

we'll want to return our moves as an array of `{ moveFrom, moveTo, usedDie }` objects


```js
export const calculateLegalMoves = ({ chips, dice, turn, whiteJail, blackJail })=>{
  if( !dice.length ) return [];

  if( (turn === 'white') && (whiteJail > 0) ){
    // check if 23-18 are legal moves by dice
    return dice.filter(die => ( chips[ 24 - die ] <= 1 ))
               .map(die => ({ moveFrom: 'whiteJail', moveTo: 24 - die, usedDie: die }) );
    
  } else if( (turn === 'black') && (blackJail > 0) ){
    // check if 0-5 are legal moves by dice
    return dice.filter(die => ( chips[ die - 1 ] >= -1 ))
               .map(die => ({ moveFrom: 'blackJail', moveTo: die - 1, usedDie: die }) );
    
  } else {
    // for all dice we have, for all the chips we have, check if chip +/- die is legal

    // if all pieces are in last 6, calculate legal home moves
  }
};
```

moving from jail is fairly straightforward, let's use `.reduce` to calculate legal board moves

```
first, compute direction (+1 for black, -1 for white) for convenience

second, compute a list of unique dice so we don't compute duplicate moves

for each of the chips, if it isn't our pieces, there aren't any new moves

if it is, then any unique die which leads to a legal move should make a new move

the new move should be from the chip we're inspecting, to die * direction away

all the new moves from this chip should be returned along with anything else we had so far
```



``` js
//...
    const direction = turn === 'black' ? 1 : -1;
    
    const uniqueDice = Array.from(new Set(dice));
    
    const legalMoves = chips.reduce((moves, chip, i)=> (
      ( chip * direction <= 0 ) ? moves : [
        ...moves,
        ...uniqueDice.filter(die => (
          (chips[ i + direction * die ] * direction >= -1)
        )).map(die => ({ moveFrom: i, moveTo: i + direction * die, usedDie: die })),
      ]
    ), []);

//...

```

and now the home moves, which although intuitive for people, are a bit more comlicated to code


```
calculate how far the furthest piece is from home

if > 6, no legal home moves (we already know we aren't in jail by the else block we're in)

for each spot between 0-5 (white) 18-23 (black)  we have a legal move if
 - we have the exact die OR
 - this is the furthest piece and we have a bigger die
 
 moveFrom will be the spot
 moveTo will be this player's home
 usedDie will be the exact die or the biggest die
```


```js
//...

    const legalHomeMoves = (
      furthestPiece > 6
    ) ? [] : (
      turn === 'white'
    ) ? [0, 1, 2, 3, 4, 5].filter(spot=> (
      (chips[spot] < 0) && (
        (uniqueDice.filter(die => die === spot+1).length) ||
        (uniqueDice.filter(die => ((die >= furthestPiece) && (spot+1 === furthestPiece))).length)
      )
    )).map(spot => ({
      moveFrom: spot,
      moveTo: 'whiteHome',
      usedDie: uniqueDice.find(die => die === spot+1) || Math.max(...uniqueDice),
    })

    ) : [23, 22, 21, 20, 19, 18].filter(spot=> (
      (chips[spot] > 0) && (
        (uniqueDice.filter(die => die === 24-spot).length) ||
        (uniqueDice.filter(die => ((die >= furthestPiece) && (24-spot === furthestPiece))).length)
      )
    )).map(spot => ({
      moveFrom: spot,
      moveTo: 'blackHome',
      usedDie: uniqueDice.find(die => die === 24-spot) || Math.max(...uniqueDice),
    }));
    
//...
```

that could perhaps use a refactor for being too wet, I'll leave that to the reader as an exercise!


now all we have to do is return all the legal moves

```js
//...

    return [
      ...legalMoves,
      ...legalHomeMoves,
    ];

//... (just close curlies)
```


#### testing our legal moves function

let's write some test cases so we can be confident in our outcome


`$ touch src/util.test.js`

we'll want to test:

 - moving out of jail (legal moves, no legal moves)
 - moving normally around the board
 - moving home


<sub>./src/util.test.js</sub>
```js
it('moves out of jail', ()=>{
  const moves = calculateLegalMoves({
    chips: initBoard,
    dice: [2, 6],
    turn: 'white',
    whiteJail: 1,
    blackJail: 0,
  });

  expect( moves ).toHaveLength( 1 );
  expect( moves[0] ).toEqual({ moveFrom: 'whiteJail', moveTo: 22, usedDie: 2 });
});
```

now if we can't get out

```js
//...

it('no moves out of jail', ()=>{
  const moves = calculateLegalMoves({
    chips: initBoard,
    dice: [6, 6],
    turn: 'white',
    whiteJail: 1,
    blackJail: 0,
  });

  expect( moves ).toHaveLength( 0 );
});
```

now for a normal move

```js
//...

it('moves around the board', ()=>{
  const moves = calculateLegalMoves({
    chips: initBoard,
    dice: [5, 2],
    turn: 'white',
    whiteJail: 0,
    blackJail: 0,
  });

  expect( moves ).toHaveLength( 6 );

  
  const moreMoves = calculateLegalMoves({
    chips: initBoard,
    dice: [6, 2],
    turn: 'white',
    whiteJail: 0,
    blackJail: 0,
  });

  expect( moreMoves ).toHaveLength( 7 );
});
```

here I've tested two cases just to make sure the "blocking" is working


now we should test that captures are legal moves

```js
//...

it('captures', ()=>{

  const captureBoard = [
    2, 2, -1, -1, -2, -2,
    0, 0, 0, 0, 0, -9,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 11,
  ];
  
  const moves = calculateLegalMoves({
    chips: captureBoard,
    dice: [2, 3],
    turn: 'black',
    whiteJail: 0,
    blackJail: 0,
  });

  expect( moves ).toHaveLength( 3 );
});

```



and for moving home, we'll need another arrangement of pieces

```js
//...

it('moves home', ()=>{

  const moveHomeBoard = [
    -15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 5, 5, 5,
  ];
  
  const moves = calculateLegalMoves({
    chips: moveHomeBoard,
    dice: [6, 2],
    turn: 'black',
    whiteJail: 0,
    blackJail: 0,
  });

  expect( moves ).toHaveLength( 3 );
});

```


while that doesn't test every possible case, it is fairly exhaustive and should therefore make us feel more confident in our solution.




#### testing our legal moves function

#### calculate board after move

#### testing board after move (jail, captures, normal moves, home)

((()))


#### finally moving the pieces

```js
        makeMove={makeMove}
```

in the `chipClicked` function



((( these are old notes - review them nik! )))


### ending the turn (blockades)

as we mentioned before, every time the array of legal moves changes (dice are rolled, a piece is moved), we will want to calculate a new array of legal moves

if that array is empty, the turn is over.

by storing the `legalMoves` in `state`, we could also (as homework!) highlight the chips which the player could move to / from


we will implement this by using [react setState callback](https://stackoverflow.com/questions/42038590/when-to-use-react-setstate-callback)


in our `roll` function and our `makeMove` function, we'll call a new function `updateLegalMoves` which will update the legal moves in `state`

that `setState` call will also have a callback to call another new function (we bill by the function) `checkTurnOver` which will trigger the `turn` change

<sub>./src/App.js</sub>
```js
//...

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

//...

        // else this is a second click
        // if the space selected is a valid move, makeMove(clicked)
        const moveIfLegal = legalMoves.find(move=> move.moveTo === clicked);
        console.log(moveIfLegal);
        if( moveIfLegal ) makeMove(moveIfLegal);

//... (App)

  makeMove: (state, { payload: move })=> ({
    ...state,
    ...calculateBoardAfterMove(state, move),
    selectedChip: null,
  }),


//... util

const otherTurn = { black: 'white', white: 'black' };

  const nextTurn = dice.length && !nextDice.length ? otherTurn[turn] : turn;
  
  return {
    dice: nextDice,
    chips: nextChips,
    turn: nextTurn,


//...

    if( !dice.length ) return;
    const moveIfLegal = legalMovesForSelectedChip.find(move=> move.moveTo === clicked);
    
    // if turn is in jail
    if( (turn === 'black' && blackJail) || (turn === 'white' && whiteJail) ){
      // if click is on valid move, makeMove(clicked) (return)
      if( moveIfLegal ) makeMove(moveIfLegal);
      


//... blockades

  endTurn: state => ({ ...state, turn: otherTurn[state.turn], dice: [] })
  const { selectChip, unselectChip, setDice, makeMove, endTurn } = useMemo(()=> actions(setGame), [setGame]);

        endTurn={endTurn}

  useEffect(()=> dice.length && !legalMoves.length ? endTurn() : null, [legalMoves, dice]);

// maybe we need to show the dice for a second or two (for jailblockade)

  useEffect(()=> dice.length && !legalMoves.length ? setTimeout(endTurn, dice.length * 1000) : null, [legalMoves, dice]);


```



### moving home (double clicks)

once the player has gotten their pieces in the home stretch (the last 6 chips before their home), double clicking on a piece should move it home (if that is a legal move)


<sub>./src/App.js</sub>
```js
//...
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
  
//...
```

### starting the game correctly

the correct start of a game of sheshbesh is that both players roll 1 die and the larger roll goes first

so, let's recreate that by setting `turn` initially to `null`, and having the roll button do the first roll for both players

then set whose turn it is based on which die is larger


<sub>./src/App.js</sub>
```js
//...

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


const differentDice = ()=>{
  let dice = [];
  while(!dice.length || (dice[0] === dice[1])) dice = randomDice();
  return dice;
};

  startGame: (state, {payload: dice}={})=> ({ ...state, dice: dice, turn: dice[0] > dice[1] ? 'black' : 'white' }),
  
  const roll = useCallback(()=> (
    game.turn ?
    game.dice.length ? //|| (game.turn !== 'black')?
    null :
    setDice(randomDice()) :
    startGame(differentDice())
  ), [game.dice.length, game.turn, setDice]);


//...
```

also, we should make an indicator of whose turn it is

I want to use different looking dice for black's turn

<sub>./src/Game.js</sub>
```js
          <Dice dice={dice} turn={turn} />
```


<sub>./src/Dice.js</sub>
```js
const Dice = ({ dice, turn })=>
  dice.map((die, i)=> (
    <svg viewBox='0 0 100 100' key={i} className={['die', turn].join(' ')}>

```

<sub>./src/App.scss</sub>
```js

.die {
  height: 40px;
  width: 40px;
  margin: 3px;

  rect {
    stroke-width: 4px;
  }

  &.white rect {
    fill: white;
    stroke: black;
  }

  &.black {
    rect {
      fill: #f42c2c;
      stroke: black;
    }
    
    circle {
      fill: white;
      stroke-width: 2;
      stroke: black;
    }
  }
}

```


### blocking selectino of a piece with no moves

<sub>./src/Game.js</sub>
```js

      if( selectedChip === null ) {
        if (
          (
            (turn === 'black' && chips[clicked] > 0 ) ||
            (turn === 'white' && chips[clicked] < 0 )
          ) &&
          legalMoves.find(move => move.moveFrom === clicked)
        ) selectChip(clicked);
```



### ending the game

now that everything works well, we should reset the game if one player wins!

<sub>./src/App.js</sub>
```js
//...

  restartGame: () => initGame,

  const { selectChip, setDice, makeMove, endTurn, startGame, restartGame } = useMemo(()=> actions(setGame), [setGame]);

        endGame={restartGame}
```

<sub>./src/Game.js</sub>
```js

// props
  endGame,


  useEffect(()=> Math.max(whiteHome, blackHome) === 15 ? endGame() : null, [whiteHome, blackHome, endGame]);

```


congrats on getting through the 2 player local game

next up - the computer player!

((()))

<a name="step2"></a>
## step 2: Build a computer player for 1-player local game



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

