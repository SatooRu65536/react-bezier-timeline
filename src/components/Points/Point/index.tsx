import styles from './index.module.css';
import { DragEndHandler, PointDragStartHandler, Position } from '@/types';
import { memo, useState } from 'react';
import { PointStyle } from '@/index';

type Props = PointStyle & {
  position: Position;
  index: number;

  onDragStart: PointDragStartHandler;
  onDragEnd: DragEndHandler;
};

export const Point = memo(
  ({
    position,
    index,
    size,
    color,
    borderColor,
    borderWeight,
    selectedSize,
    selectedColor,
    selectedBorderColor,
    selectedBorderWeight,
    onDragStart,
    onDragEnd,
  }: Props) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleOnMouseDown = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
      setIsSelected(true);
      onDragStart(index, e.clientX, e.clientY);
    };

    const handleOnMouseUp = () => {
      setIsSelected(false);
      onDragEnd();
    };

    return (
      <circle
        className={styles.point}
        cx={position.x}
        cy={position.y}
        r={isSelected ? selectedSize : size}
        fill={isSelected ? selectedColor : color}
        stroke={isSelected ? selectedBorderColor : borderColor}
        strokeWidth={isSelected ? selectedBorderWeight : borderWeight}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
      />
    );
  },
);
