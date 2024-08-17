import { SVGProps } from "react";
import Curve from "./components/Curve";
import { BezierCurve, ViewRange } from "./types";
import { mapPairs, toDrawPoints } from "./utils";

type Props = SVGProps<SVGSVGElement> & {
  bezierCurve: BezierCurve;
  width?: number;
  height?: number;
  xRange?: ViewRange;
  yRange?: ViewRange;
};

export default function BezierTimeline({
  bezierCurve,
  width = 200,
  height = 200,
  xRange = [-10, width + 10],
  yRange = [-10, height + 10],
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
        <Curve key={i} left={left} right={right} />
      ))}
    </svg>
  );
}
