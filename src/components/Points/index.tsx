import { PointStyle } from '@/index';
import { BezierCurve } from '@/types';
import { memo } from 'react';
import { Point } from './Point';

interface Props {
  bezierCurve: BezierCurve;
  pointStyle: PointStyle;
}

export const Points = memo(({ bezierCurve, pointStyle }: Props) => {
  return (
    <g>
      {bezierCurve.map((point, i) => (
        <Point key={i} position={point.position} {...pointStyle} />
      ))}
    </g>
  );
});
