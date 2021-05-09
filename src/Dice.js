import React from 'react';

const Dice = ({ dice, turn })=>
  dice.map((die, i)=> (
    <svg viewBox='0 0 100 100' key={i} className={['die', turn].join(' ')}>
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
