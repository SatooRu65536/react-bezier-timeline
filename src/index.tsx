import { SVGProps } from "react";
import { Curve } from "./components/Curve";
import { BezierCurve, ViewRange } from "./types";
import { mapPairs, toDrawPoints } from "./utils";
import { Circle } from "./components/Circle";

type Props = SVGProps<SVGSVGElement> & {
  bezierCurve: BezierCurve;

  // 描画範囲
  width?: number;
  height?: number;
  xRange?: ViewRange;
  yRange?: ViewRange;

  // 線の見た目
  lineColor?: string;
  lineWidth?: number;

  // 点の見た目
  pointSize?: number;
  pointColor?: string;
  pointBorderColor?: string;
  pointBorderWidth?: number;
};

export default function BezierTimeline({
  bezierCurve,
  width = 200,
  height = 200,
  xRange = [-10, width + 10],
  yRange = [-10, height + 10],

  lineColor = "#007BFF",
  lineWidth = 3,

  pointSize = 5,
  pointColor = "#ffffff",
  pointBorderColor = "#007BFF",
  pointBorderWidth = 3,

  ...props
}: Props) {
  const convertedBezierCurve = toDrawPoints(
    bezierCurve,
    width,
    height,
    xRange,
    yRange,
  );
  console.log(convertedBezierCurve);

  return (
    <svg width={width} height={height} {...props}>
      {mapPairs(convertedBezierCurve).map(([left, right], i) => (
        <Curve
          key={i}
          left={left}
          right={right}
          lineColor={lineColor}
          lineWidth={lineWidth}
        />
      ))}

      {convertedBezierCurve.map((point, i) => (
        <Circle
          key={i}
          position={point.position}
          size={pointSize}
          color={pointColor}
          borderColor={pointBorderColor}
          borderWidth={pointBorderWidth}
        />
      ))}
    </svg>
  );
}
