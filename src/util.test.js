import { initBoard, calculateLegalMoves, calculateBoardAfterMove, calculateBoardOutcomes } from './util';

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




it('moves pieces out of jail', ()=>{
  const { chips, dice, turn, whiteJail, blackJail, whiteHome, blackHome} =
    calculateBoardAfterMove({
      chips: initBoard,
      dice: [2, 6],
      turn: 'white',
      whiteJail: 1,
      blackJail: 0,
      whiteHome: 0,
      blackHome: 0,
    }, {
      moveFrom: 'whiteJail',
      moveTo: 22,
      usedDie: 2
    });

  expect( chips[22] ).toEqual( -1 );
  expect( dice ).toEqual([ 6 ]);
  expect( turn ).toEqual('white');
  expect( whiteJail ).toEqual( 0 );
  expect( blackJail ).toEqual( 0 );
  expect( whiteHome ).toEqual( 0 );
  expect( blackHome ).toEqual( 0 );
});


it('captures enemies', ()=>{
  const captureBoard = [
    2, 2, -1, -1, -2, -2,
    0, 0, 0, 0, 0, -9,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 11,
  ];

  const { chips, dice, turn, whiteJail, blackJail, whiteHome, blackHome} =
    calculateBoardAfterMove({
      chips: captureBoard,
      dice: [2, 3],
      turn: 'black',
      whiteJail: 0,
      blackJail: 0,
      whiteHome: 0,
      blackHome: 0,
    }, {
      moveFrom: 0,
      moveTo: 3,
      usedDie: 3
    });

  expect( chips[0] ).toEqual( 1 );
  expect( chips[3] ).toEqual( 1 );
  expect( dice ).toEqual([ 2 ]);
  expect( turn ).toEqual('black');
  expect( whiteJail ).toEqual( 1 );
  expect( blackJail ).toEqual( 0 );
  expect( whiteHome ).toEqual( 0 );
  expect( blackHome ).toEqual( 0 );
});

it('moves pieces around the board', ()=>{
  const { chips, dice, turn, whiteJail, blackJail, whiteHome, blackHome} =
    calculateBoardAfterMove({
      chips: initBoard,
      dice: [2, 6],
      turn: 'white',
      whiteJail: 0,
      blackJail: 0,
      whiteHome: 0,
      blackHome: 0,
    }, {
      moveFrom: 23,
      moveTo: 17,
      usedDie: 6
    });

  expect( chips[23] ).toEqual( -1 );
  expect( chips[17] ).toEqual( -1 );
  expect( dice ).toEqual([ 2 ]);
  expect( turn ).toEqual('white');
  expect( whiteJail ).toEqual( 0 );
  expect( blackJail ).toEqual( 0 );
  expect( whiteHome ).toEqual( 0 );
  expect( blackHome ).toEqual( 0 );
});

it('moves pieces home furthest', ()=>{
  const moveHomeBoard = [
    -15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 5, 5, 5,
  ];

  const { chips, dice, turn, whiteJail, blackJail, whiteHome, blackHome} =
    calculateBoardAfterMove({
      chips: moveHomeBoard,
      dice: [2, 6],
      turn: 'black',
      whiteJail: 0,
      blackJail: 0,
      whiteHome: 0,
      blackHome: 0,
    }, {
      moveFrom: 21,
      moveTo: 'blackHome',
      usedDie: 6,
    });

  expect( chips[21] ).toEqual( 4 );
  expect( dice ).toEqual([ 2 ]);
  expect( turn ).toEqual('black');
  expect( whiteJail ).toEqual( 0 );
  expect( blackJail ).toEqual( 0 );
  expect( whiteHome ).toEqual( 0 );
  expect( blackHome ).toEqual( 1 );
});

it('moves pieces home', ()=>{
  const moveHomeBoard = [
    -15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 5, 5, 5,
  ];

  const { chips, dice, turn, whiteJail, blackJail, whiteHome, blackHome} =
    calculateBoardAfterMove({
      chips: moveHomeBoard,
      dice: [2, 6],
      turn: 'black',
      whiteJail: 0,
      blackJail: 0,
      whiteHome: 0,
      blackHome: 0,
    }, {
      moveFrom: 22,
      moveTo: 'blackHome',
      usedDie: 2,
    });

  expect( chips[22] ).toEqual( 4 );
  expect( dice ).toEqual([ 6 ]);
  expect( turn ).toEqual('black');
  expect( whiteJail ).toEqual( 0 );
  expect( blackJail ).toEqual( 0 );
  expect( whiteHome ).toEqual( 0 );
  expect( blackHome ).toEqual( 1 );
});




it('calculates the options to capture and move home', ()=>{
  const optionsChips = [
    -5, 0, 0, -3, -3, -3,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    2, 2, 1, 5, -1, 5,
  ];

  const whiteOutcomes = calculateBoardOutcomes({
    chips: optionsChips,
    dice: [2],
    turn: 'white',
    whiteJail: 0,
    blackJail: 0,
    whiteHome: 0,
    blackHome: 0,
  });

  expect( whiteOutcomes ).toHaveLength( 4 );
  expect( whiteOutcomes.filter(o => o.board.blackJail) ).toHaveLength( 1 );
  
  const blackOutcomes = calculateBoardOutcomes({
    chips: optionsChips,
    dice: [6, 2],
    turn: 'black',
    whiteJail: 0,
    blackJail: 0,
    whiteHome: 0,
    blackHome: 0,
  });

  expect( blackOutcomes ).toHaveLength( 8 );
  expect( blackOutcomes.filter(o => o.board.whiteJail) ).toHaveLength( 2 );
  expect( blackOutcomes.filter(o => o.board.blackHome) ).toHaveLength( 8 );
});


it('calculates the options to move out of jail', ()=>{
  const jailChips = [
    -5, 0, 0, -3, -2, -3,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    2, 2, 1, 5, -1, 5,
  ];

  const whiteOutcomes = calculateBoardOutcomes({
    chips: jailChips,
    dice: [2, 4],
    turn: 'white',
    whiteJail: 1,
    blackJail: 0,
    whiteHome: 0,
    blackHome: 0,
  });

  expect( whiteOutcomes ).toHaveLength( 6 );
  expect( whiteOutcomes.filter(o => o.board.blackJail) ).toHaveLength( 4 );
});


it('calculates the options are empty when blockaded', ()=>{
  const blockadeChips = [
    -5, 0, 0, -3, -2, -3,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    2, 2, 2, 5, 2, 2,
  ];

  const whiteOutcomes = calculateBoardOutcomes({
    chips: blockadeChips,
    dice: [1, 2, 3, 4, 5, 6],
    turn: 'white',
    whiteJail: 2,
    blackJail: 0,
    whiteHome: 0,
    blackHome: 0,
  });

  expect( whiteOutcomes ).toHaveLength( 0 );
});
