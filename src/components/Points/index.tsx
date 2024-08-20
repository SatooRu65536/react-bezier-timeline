import { PointStyle } from '@/index';
import { BezierCurveWithId, DragEndHandler, PointDragStartHandler } from '@/types';
import { memo } from 'react';
import { Point } from './Point';

interface Props {
  bezierCurve: BezierCurveWithId;
  pointStyle: PointStyle;

  onDragStart: PointDragStartHandler;
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
