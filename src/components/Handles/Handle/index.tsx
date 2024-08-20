import styles from './index.module.css';
import { DragEndHandler, HandleDragStartHandler, HandleType, Position } from '@/types';
import { memo, MouseEventHandler, useState } from 'react';
import { HandleStyle } from '@/index';

type Props = HandleStyle & {
  index: number;
  type: HandleType;
  position: Position;
  origin: Position;

  onDragStart: HandleDragStartHandler;
  onDragEnd: DragEndHandler;
};

export const Handle = memo(
  ({
    index,
    type,
    position,
    origin,
    size = 0,
    color,
    borderColor,
    borderWidth,
    lineColor,
    lineWidth,
    selectedSize = 0,
    selectedColor,
    selectedBorderColor,
    selectedBorderWidth,
    selectedLineColor,
    selectedLineWidth,
    onDragStart,
    onDragEnd,
  }: Props) => {
    const [isSelected, setIsSelected] = useState(false);

    const angle = Math.atan2(position.y, -position.x) * (180 / Math.PI) - 45;
    const x = origin.x + position.x - size / 2;
    const y = origin.y - position.y - size / 2;
    const size_ = isSelected ? selectedSize : size;

    const handleOnMouseDown: MouseEventHandler<SVGRectElement> = (e) => {
      setIsSelected(true);
      onDragStart(index, e.clientX, e.clientY, type);
    };

    const handleOnMouseUp: MouseEventHandler<SVGRectElement> = () => {
      setIsSelected(false);
      onDragEnd();
    };

    return (
      <g>
        <line
          className={styles.handle_line}
          x1={origin.x}
          y1={origin.y}
          x2={origin.x + position.x}
          y2={origin.y - position.y}
          stroke={isSelected ? selectedLineColor : lineColor}
          strokeWidth={isSelected ? selectedLineWidth : lineWidth}
        />
        <g transform={`translate(${x}, ${y})`}>
          <rect
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: `${size_ / 2}px ${size_ / 2}px`,
            }}
            className={styles.handle_rect}
            width={size_}
            height={size_}
            fill={isSelected ? selectedColor : color}
            stroke={isSelected ? selectedBorderColor : borderColor}
            strokeWidth={isSelected ? selectedBorderWidth : borderWidth}
            onMouseDown={handleOnMouseDown}
            onMouseUp={handleOnMouseUp}
          />
        </g>
      </g>
    );
  },
);
