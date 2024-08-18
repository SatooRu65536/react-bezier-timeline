import styles from './index.module.css';
import { DragEndHandler, DragStartHandler, Position } from '@/types';
import { memo } from 'react';
import { PointStyle } from '@/index';

type Props = PointStyle & {
  position: Position;
  index: number;

  onDragStart: DragStartHandler;
  onDragEnd: DragEndHandler;
};

export const Point = memo(
  ({ position, index, size, color, borderColor, borderWeight, onDragStart, onDragEnd }: Props) => {
    return (
      <circle
        className={styles.point}
        cx={position.x}
        cy={position.y}
        r={size}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWeight}
        onMouseDown={(e) => onDragStart(index, e.clientX, e.clientY)}
        onMouseUp={onDragEnd}
      />
    );
  },
);
