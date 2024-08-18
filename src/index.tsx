import { SVGProps } from 'react';
import { BezierCurve, ViewRange } from './types';
import { getViewRatio, toDrawPoints } from './utils';
import { Grid } from './components/Grid';
import { Label } from './components/Label';
import { Handles } from './components/Handles';
import { Curves } from './components/Curves';
import { Points } from './components/Points';
import { useBezierCurve } from './hooks/useBezierCurve';

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

export type BezierTimelineProps = SVGProps<SVGSVGElement> & {
  defaultBezierCurve: BezierCurve;

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

const defaultWidth = 200;
const defaultHeight = 200;
const defaultXRange = [-10, defaultWidth + 10] satisfies ViewRange;
const defaultYRange = [-10, defaultHeight + 10] satisfies ViewRange;
const defaultLineStyle = {
  color: '#343A40',
  weight: 3,
} satisfies LineStyle;
const defaultPointStyle = {
  size: 4,
  color: '#ffffff',
  borderColor: '#007BFF',
  borderWeight: 2,
} satisfies PointStyle;
const defaultHandleStyle = {
  size: 5,
  color: '#ffffff',
  borderColor: '#007BFF',
  borderWidth: 1,
  lineColor: '#000000',
  lineWeight: 1,
} satisfies HandleStyle;
const defaultGridStyle = {
  hidden: false,
  xStep: 50,
  yStep: 50,
  color: '#000000',
  weight: 1,
  opacity: 0.2,
} satisfies GridStyle;
const defaultLabelStyle = {
  hidden: false,
  size: 12,
  color: '#000000',
  xStep: defaultGridStyle.xStep,
  yStep: defaultGridStyle.yStep,
  xPosition: ['left'],
  yPosition: ['bottom'],
} satisfies LabelStyle;

export default function BezierTimeline({
  width = defaultWidth,
  height = defaultHeight,
  xRange = defaultXRange,
  yRange = defaultYRange,
  lineStyle = defaultLineStyle,
  pointStyle = defaultPointStyle,
  handleStyle = defaultHandleStyle,
  gridStyle = defaultGridStyle,
  labelStyle = defaultLabelStyle,
  ...props
}: BezierTimelineProps) {
  const { defaultBezierCurve, ...rest } = props;

  const [ratioX, ratioY] = getViewRatio(width, height, xRange, yRange);
  const { bezierCurve, onPointDragStart, onDrag, onDragEnd } = useBezierCurve({
    defaultBezierCurve,
    ratioX,
    ratioY,
  });

  const convertedBezierCurve = toDrawPoints(bezierCurve, width, height, xRange, yRange);

  return (
    <svg width={width} height={height} {...rest} onMouseMove={(e) => onDrag(e.clientX, e.clientY)}>
      <Grid width={width} height={height} xRange={xRange} yRange={yRange} {...gridStyle} />
      <Label width={width} height={height} xRange={xRange} yRange={yRange} {...labelStyle} />

      <Handles bezierCurve={convertedBezierCurve} handleStyle={handleStyle} />
      <Curves bezierCurve={convertedBezierCurve} lineStyle={lineStyle} />
      <Points
        bezierCurve={convertedBezierCurve}
        pointStyle={pointStyle}
        onDragStart={onPointDragStart}
        onDragEnd={onDragEnd}
      />
    </svg>
  );
}
