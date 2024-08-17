import { SVGProps } from 'react';
import { Curve } from './components/Curve';
import { BezierCurve, ViewRange } from './types';
import { mapPairs, toDrawPoints } from './utils';
import { Point } from './components/Point';
import { Handle } from './components/Handle';

// 線の見た目
export interface LineStyle {
  color?: string;
  width?: number;
}

// 点の見た目
export interface PointStyle {
  size?: number;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
}

// ハンドルの見た目
export interface HandleStyle {
  size?: number;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  lineColor?: string;
  lineWidth?: number;
}

type Props = SVGProps<SVGSVGElement> & {
  bezierCurve: BezierCurve;

  // 描画範囲
  width?: number;
  height?: number;
  xRange?: ViewRange;
  yRange?: ViewRange;

  // 見た目
  lineStyle?: LineStyle;
  pointStyle?: PointStyle;
  handleStyle?: HandleStyle;
};

export default function BezierTimeline({
  bezierCurve,
  width = 200,
  height = 200,
  xRange = [-10, width + 10],
  yRange = [-10, height + 10],

  lineStyle = {
    color: '#343A40',
    width: 3,
  },
  pointStyle = {
    size: 4,
    color: '#ffffff',
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  handleStyle = {
    size: 5,
    color: '#ffffff',
    borderColor: '#007BFF',
    borderWidth: 1,
    lineColor: '#000000',
    lineWidth: 1,
  },

  ...props
}: Props) {
  const convertedBezierCurve = toDrawPoints(bezierCurve, width, height, xRange, yRange);

  return (
    <svg width={width} height={height} {...props}>
      {convertedBezierCurve.map((point, i) => (
        <g key={i}>
          {point.handleL != undefined && <Handle position={point.handleL} origin={point.position} {...handleStyle} />}
          {point.handleR != undefined && <Handle position={point.handleR} origin={point.position} {...handleStyle} />}
        </g>
      ))}

      {mapPairs(convertedBezierCurve).map(([left, right], i) => (
        <Curve key={i} left={left} right={right} {...lineStyle} />
      ))}

      {convertedBezierCurve.map((point, i) => (
        <Point key={i} position={point.position} {...pointStyle} />
      ))}
    </svg>
  );
}
