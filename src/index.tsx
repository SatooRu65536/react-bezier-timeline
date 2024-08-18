import { SVGProps } from 'react';
import { Curve } from './components/Curve';
import { BezierCurve, ViewRange } from './types';
import { mapPairs, toDrawPoints } from './utils';
import { Point } from './components/Point';
import { Handle } from './components/Handle';
import { Grid } from './components/Grid';
import { Label } from './components/Label';

// 線の見た目
export interface LineStyle {
  color?: string;
  weight?: number;
}
// 点の見た目
export interface PointStyle {
  size?: number;
  color?: string;
  borderColor?: string;
  borderWeight?: number;
}
// ハンドルの見た目
export interface HandleStyle {
  size?: number;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  lineColor?: string;
  lineWeight?: number;
}
// グリッドの見た目
export interface GridStyle {
  hidden?: boolean;
  color?: string;
  weight?: number;
  opacity?: number;
  xStep?: number;
  yStep?: number;
}
// ラベルの見た目
export interface LabelStyle {
  hidden?: boolean | [boolean, boolean];
  size?: number;
  color?: string;
  backgroundColor?: string;
  xStep?: number;
  yStep?: number;
  xPosition?: ('left' | 'right')[];
  yPosition?: ('top' | 'bottom')[];
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
  gridStyle?: GridStyle;
  labelStyle?: LabelStyle;
};

export default function BezierTimeline({
  bezierCurve,
  width = 200,
  height = 200,
  xRange = [-10, width + 10],
  yRange = [-10, height + 10],

  lineStyle = {
    color: '#343A40',
    weight: 3,
  },
  pointStyle = {
    size: 4,
    color: '#ffffff',
    borderColor: '#007BFF',
    borderWeight: 2,
  },
  handleStyle = {
    size: 5,
    color: '#ffffff',
    borderColor: '#007BFF',
    borderWidth: 1,
    lineColor: '#000000',
    lineWeight: 1,
  },
  gridStyle = {
    hidden: false,
    xStep: 50,
    yStep: 50,
    color: '#000000',
    weight: 1,
    opacity: 0.2,
  },
  labelStyle = {
    hidden: false,
    size: 12,
    color: '#000000',
    xStep: gridStyle.xStep,
    yStep: gridStyle.yStep,
    xPosition: ['left'],
    yPosition: ['bottom'],
  },

  ...props
}: Props) {
  const convertedBezierCurve = toDrawPoints(bezierCurve, width, height, xRange, yRange);

  return (
    <svg width={width} height={height} {...props}>
      <Grid width={width} height={height} xRange={xRange} yRange={yRange} {...gridStyle} />

      <Label width={width} height={height} xRange={xRange} yRange={yRange} {...labelStyle} />

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
