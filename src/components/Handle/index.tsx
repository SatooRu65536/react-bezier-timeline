import styles from './index.module.css';
import { Position } from '@/types';
import { memo } from 'react';
import { HandleStyle } from '@/index';

type Props = HandleStyle & {
  position: Position;
  origin: Position;
};

export const Handle = memo(
  ({ position, origin, size, color, borderColor, borderWidth, lineColor, lineWidth }: Props) => {
    return (
      <g>
        <line
          className={styles.handle_line}
          x1={origin.x}
          y1={origin.y}
          x2={origin.x + position.x}
          y2={origin.y + position.y}
          stroke={lineColor}
          strokeWidth={lineWidth}
        />
        <circle
          className={styles.handle_circle}
          cx={origin.x + position.x}
          cy={origin.y - position.y}
          r={size}
          fill={color}
          stroke={borderColor}
          strokeWidth={borderWidth}
        />
      </g>
    );
  },
);
