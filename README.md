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

to make things easy, let's make some transparent rectangles above each of the spaces on the board for them to click

we'll collect single and double click events (we'll use the double clicks to move a piece home when that's allowed)


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






This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

