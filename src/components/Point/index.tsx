import styles from './index.module.css';
import { Position } from '@/types';
import { memo } from 'react';
import { PointStyle } from '@/index';

type Props = PointStyle & {
  position: Position;
};

export const Point = memo(({ position, size, color, borderColor, borderWidth }: Props) => {
  return (
    <circle
      className={styles.point}
      cx={position.x}
      cy={position.y}
      r={size}
      fill={color}
      stroke={borderColor}
      strokeWidth={borderWidth}
    />
  );
});
