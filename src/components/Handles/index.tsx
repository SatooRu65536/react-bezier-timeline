import styles from './index.module.css';
import { HandleStyle } from '@/index';
import { BezierCurve, DragEndHandler, HandleDragStartHandler } from '@/types';
import { memo } from 'react';
import { Handle } from './Handle';

interface Props {
  hidden: boolean;
  bezierCurve: BezierCurve;
  handleStyle: HandleStyle;

  onDragStart: HandleDragStartHandler;
  onDragEnd: DragEndHandler;
}

export const Handles = memo(({ hidden, bezierCurve, handleStyle, onDragStart, onDragEnd }: Props) => {
  return (
    <g className={styles.handles} style={{ opacity: hidden ? 0 : 1 }}>
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
