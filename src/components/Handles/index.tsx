import { HandleStyle } from '@/index';
import { BezierCurve } from '@/types';
import { memo } from 'react';
import { Handle } from './Handle';

interface Props {
  bezierCurve: BezierCurve;
  handleStyle: HandleStyle;
}

export const Handles = memo(({ bezierCurve, handleStyle }: Props) => {
  return (
    <g>
      {bezierCurve.map((point, i) => (
        <g key={i}>
          {point.handleL != undefined && <Handle position={point.handleL} origin={point.position} {...handleStyle} />}
          {point.handleR != undefined && <Handle position={point.handleR} origin={point.position} {...handleStyle} />}
        </g>
      ))}
    </g>
  );
});
