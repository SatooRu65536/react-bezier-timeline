import { SvgStyle } from '@/index';
import styles from './index.module.css';
import { memo, ReactNode } from 'react';
import { DragHandler } from '@/types';

type Props = SvgStyle & {
  children: ReactNode;
  isSelected: boolean;
  onDrag: DragHandler;
};

export const SVG = memo(({ children, width, height, isSelected, onDrag, ...props }: Props) => {
  return (
    <svg
      className={styles.svg}
      width={width}
      height={height}
      {...props}
      onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
      data-selected={isSelected}
    >
      {children}
    </svg>
  );
});
