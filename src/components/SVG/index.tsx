import { SvgStyle } from '@/index';
import styles from './index.module.css';
import { memo, ReactNode } from 'react';
import { DragEndHandler, DragHandler } from '@/types';

type Props = SvgStyle & {
  children: ReactNode;
  isSelected: boolean;

  onDrag: DragHandler;
  onDragEnd: DragEndHandler;
};

export const SVG = memo(({ children, width, height, isSelected, onDrag, onDragEnd, ...props }: Props) => {
  return (
    <svg
      className={styles.svg}
      width={width}
      height={height}
      {...props}
      onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
      onMouseUp={onDragEnd}
      data-selected={isSelected}
    >
      {children}
    </svg>
  );
});
