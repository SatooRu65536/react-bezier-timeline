import { Position } from "@/types";
import { memo } from "react";

interface Props {
  position: Position;
  size: number;
  color: string;
  borderColor: string;
  borderWidth: number;
}

export const Circle = memo(
  ({ position, size, color, borderColor, borderWidth }: Props) => {
    return (
      <circle
        cx={position.x}
        cy={position.y}
        r={size}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
    );
  },
);
