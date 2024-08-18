import { SvgStyle } from '@/index';
import styles from './index.module.css';
import { memo, MouseEventHandler, ReactNode } from 'react';
import { AddPointHandler, DragEndHandler, DragHandler } from '@/types';

type Props = SvgStyle & {
  children: ReactNode;
  isSelected: boolean;

  onDrag: DragHandler;
  onDragEnd: DragEndHandler;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  handleAddPoint: AddPointHandler;
};

export const SVG = memo(
  ({
    children,
    width,
    height,
    isSelected,
    onDrag,
    onDragEnd,
    onMouseEnter,
    onMouseLeave,
    handleAddPoint,
    ...props
  }: Props) => {
    const onMouseMove: MouseEventHandler<SVGSVGElement> = (e) => {
      onDrag(e.clientX, e.clientY);
    };

    const onContextMenu: MouseEventHandler<SVGSVGElement> = (e) => {
      e.preventDefault();

      const { top, left } = e.currentTarget.getBoundingClientRect();
      handleAddPoint(e.clientX, e.clientY, top, left);
    };

    return (
      <svg
        className={styles.svg}
        width={width}
        height={height}
        {...props}
        onMouseMove={onMouseMove}
        onMouseUp={onDragEnd}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        data-selected={isSelected}
      >
        {children}
      </svg>
    );
  },
);
