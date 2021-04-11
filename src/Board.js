import React from 'react';

const centers = [
  1345, 1239, 1133, 1027, 921, 815, 605, 499, 393, 287, 181, 75,
];

const Board = ({
  whiteHome,
  blackHome,
  whiteJail,
  blackJail,
  chips,
})=> (
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

    {[0, 180].map(angle=> (
      <g key={angle} style={{ transform: 'rotate('+angle+'deg)', transformOrigin:'47.33% 50%' }}>
        {[...Array(12)].map((_, i)=>(
          <polygon key={i}
                   points={`${centers[i]-50},20 ${centers[i]+50},20 ${centers[i]},450`}
                   className={(i%2 ? 'black' : 'white')+'-triangle'} />
        ))}
      </g>
    ))}


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

        </g>
      ))
    }

  </svg>
);

export default Board;
