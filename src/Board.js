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
  selectedChip,
  onClick = ()=> 0,
  onDoubleClick = ()=> 0,
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
                   className={[
                     (i%2 ? 'black' : 'white')+'-triangle',
                     selectedChip === (i + angle / 15) ? 'selected-chip' : ''
                   ].join(' ')} />
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

          <rect x={centers[Math.min( i, 2*centers.length - i - 1 )] - 50}
                width={100}
                y={ i < 12 ? 20 : 550 } height={430}
                fill='transparent' stroke='transparent'
                onDoubleClick={()=> onDoubleClick(i)}
                onClick={()=> onClick(i)} />

        </g>
      ))
    }

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


  </svg>
);

export default Board;
