import { PointStyle } from '@/index';
import { BezierCurve, DragEndHandler, DragStartHandler } from '@/types';
import { memo } from 'react';
import { Point } from './Point';

interface Props {
  bezierCurve: BezierCurve;
  pointStyle: PointStyle;

  onDragStart: DragStartHandler;
  onDragEnd: DragEndHandler;
}

export const Points = memo(({ bezierCurve, pointStyle, onDragStart, onDragEnd }: Props) => {
  return (
    <g>
      {bezierCurve.map((point, i) => (
        <Point
          key={i}
          index={i}
          position={point.position}
          {...pointStyle}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </g>
  );
});
