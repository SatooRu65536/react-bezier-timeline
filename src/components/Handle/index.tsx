import styles from './index.module.css';
import { Position } from '@/types';
import { memo } from 'react';
import { HandleStyle } from '@/index';

type Props = HandleStyle & {
  position: Position;
  origin: Position;
};

export const Handle = memo(
  ({ position, origin, size: size_, color, borderColor, borderWidth, lineColor, lineWidth }: Props) => {
    const size = size_ ?? 0;

    const angle = Math.atan2(position.y, -position.x) * (180 / Math.PI) - 45;
    const x = origin.x + position.x - size / 2;
    const y = origin.y - position.y - size / 2;

    return (
      <g>
        <line
          className={styles.handle_line}
          x1={origin.x}
          y1={origin.y}
          x2={origin.x + position.x}
          y2={origin.y - position.y}
          stroke={lineColor}
          strokeWidth={lineWidth}
        />
        <g transform={`translate(${x}, ${y})`}>
          <rect
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: `${size / 2}px ${size / 2}px`,
            }}
            className={styles.handle_rect}
            width={size}
            height={size}
            fill={color}
            stroke={borderColor}
            strokeWidth={borderWidth}
          />
        </g>
      </g>
    );
  },
);
