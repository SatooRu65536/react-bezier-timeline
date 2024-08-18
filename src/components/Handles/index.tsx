import { HandleStyle } from '@/index';
import { BezierCurve, DragEndHandler, HandleDragStartHandler } from '@/types';
import { memo } from 'react';
import { Handle } from './Handle';

interface Props {
  bezierCurve: BezierCurve;
  handleStyle: HandleStyle;

  onDragStart: HandleDragStartHandler;
  onDragEnd: DragEndHandler;
}

export const Handles = memo(({ bezierCurve, handleStyle, onDragStart, onDragEnd }: Props) => {
  return (
    <g>
      {bezierCurve.map((point, i) => (
        <g key={i}>
          {point.handleL != undefined && (
            <Handle
              index={i}
              type="handleL"
              position={point.handleL}
              origin={point.position}
              {...handleStyle}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          )}
          {point.handleR != undefined && (
            <Handle
              index={i}
              type="handleR"
              position={point.handleR}
              origin={point.position}
              {...handleStyle}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          )}
        </g>
      ))}
    </g>
  );
});
