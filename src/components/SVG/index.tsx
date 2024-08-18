import { SvgStyle } from '@/index';
import styles from './index.module.css';
import { memo, ReactNode, useState } from 'react';
import { DragEndHandler, DragHandler, ViewDragStartHandler } from '@/types';

type Props = SvgStyle & {
  children: ReactNode;
  isSelected: boolean;
  onDrag: DragHandler;
  onViewDragStart: ViewDragStartHandler;
  onDragEnd: DragEndHandler;
};

export const SVG = memo(
  ({ children, width, height, isSelected, onViewDragStart, onDrag, onDragEnd, ...props }: Props) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown: React.MouseEventHandler<SVGSVGElement> = (e) => {
      onViewDragStart(e.clientX, e.clientY);
      setIsDragging(true);
    };

    const handleMouseUp: React.MouseEventHandler<SVGSVGElement> = () => {
      onDragEnd();
      setIsDragging(false);
    };

    return (
      <svg
        className={styles.svg}
        width={width}
        height={height}
        {...props}
        onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-selected={isSelected}
        data-dragging={isDragging}
      >
        {children}
      </svg>
    );
  },
);
