import { LineStyle } from '@/index';
import { BezierCurve } from '@/types';
import { mapPairs } from '@/utils';
import { memo } from 'react';
import { Curve } from './Curve';

interface Props {
  bezierCurve: BezierCurve;
  lineStyle: LineStyle;
}

export const Curves = memo(({ bezierCurve, lineStyle }: Props) => {
  return (
    <g>
      {mapPairs(bezierCurve).map(([left, right], i) => (
        <Curve key={i} left={left} right={right} {...lineStyle} />
      ))}
    </g>
  );
});
