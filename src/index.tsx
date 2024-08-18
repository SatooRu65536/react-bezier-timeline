import { BezierCurve, ViewRange } from './types';
import { toDrawPoints } from './utils';
import { Grid } from './components/Grid';
import { Label } from './components/Label';
import { Handles } from './components/Handles';
import { Curves } from './components/Curves';
import { Points } from './components/Points';
import { useBezierCurve } from './hooks/useBezierCurve';
import { SVG } from './components/SVG';
import { useKeyDown } from './hooks/useKeyDown';
import { useMemo } from 'react';

// SVGの見た目
export interface SvgStyle {
  width: number;
  height: number;
}
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

  selectedSize?: number;
  selectedColor?: string;
  selectedBorderColor?: string;
  selectedBorderWeight?: number;
}
// ハンドルの見た目
export interface HandleStyle {
  hide?: boolean;
  size?: number;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  lineColor?: string;
  lineWeight?: number;

  selectedSize?: number;
  selectedColor?: string;
  selectedBorderColor?: string;
  selectedBorderWeight?: number;
  selectedLineColor?: string;
  selectedLineWeight?: number;
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

export type BezierTimelineProps = SvgStyle & {
  defaultBezierCurve: BezierCurve;

  // 描画範囲
  defaultXRange?: ViewRange;
  defaultYRange?: ViewRange;

  // 見た目
  lineStyle?: LineStyle;
  pointStyle?: PointStyle;
  handleStyle?: HandleStyle;
  gridStyle?: GridStyle;
  labelStyle?: LabelStyle;
};

const defaultWidth = 200;
const defaultHeight = 200;
const defaultXRange_ = [-10, defaultWidth + 10] satisfies ViewRange;
const defaultYRange_ = [-10, defaultHeight + 10] satisfies ViewRange;
const defaultLineStyle = {
  color: '#343A40',
  weight: 3,
} satisfies LineStyle;
const defaultPointStyle = {
  size: 4,
  color: '#ffffff',
  borderColor: '#007BFF',
  borderWeight: 2,

  selectedSize: 4,
  selectedColor: '#007BFF',
  selectedBorderColor: '#007BFF',
  selectedBorderWeight: 2,
} satisfies PointStyle;
const defaultHandleStyle = {
  hide: false,
  size: 5,
  color: '#ffffff',
  borderColor: '#007BFF',
  borderWidth: 1,
  lineColor: '#000000',
  lineWeight: 1,

  selectedSize: 5,
  selectedColor: '#007BFF',
  selectedBorderColor: '#007BFF',
  selectedBorderWeight: 1,
  selectedLineColor: '#000000',
  selectedLineWeight: 1,
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
  defaultBezierCurve,
  width = defaultWidth,
  height = defaultHeight,
  defaultXRange = defaultXRange_,
  defaultYRange = defaultYRange_,
  lineStyle = defaultLineStyle,
  pointStyle = defaultPointStyle,
  handleStyle = defaultHandleStyle,
  gridStyle = defaultGridStyle,
  labelStyle = defaultLabelStyle,
}: BezierTimelineProps) {
  const isMetaKeyDown = useKeyDown('Meta');
  const { isSelected, bezierCurve, xRange, yRange, onPointDragStart, onHandleDragStart, onDrag, onDragEnd } =
    useBezierCurve({
      defaultBezierCurve,
      width,
      height,
      defaultXRange,
      defaultYRange,
      isMetaKeyDown,
    });

  const convertedBezierCurve = useMemo(
    () => toDrawPoints(bezierCurve, width, height, xRange, yRange),
    [bezierCurve, height, width, xRange, yRange],
  );

  return (
    <SVG width={width} height={height} isSelected={isSelected} onDrag={onDrag} onDragEnd={onDragEnd}>
      <Grid width={width} height={height} xRange={xRange} yRange={yRange} {...gridStyle} />
      <Label width={width} height={height} xRange={xRange} yRange={yRange} {...labelStyle} />
      <Curves bezierCurve={convertedBezierCurve} lineStyle={lineStyle} />

      <Handles
        bezierCurve={convertedBezierCurve}
        handleStyle={handleStyle}
        onDragStart={onHandleDragStart}
        onDragEnd={onDragEnd}
      />

      <Points
        bezierCurve={convertedBezierCurve}
        pointStyle={pointStyle}
        onDragStart={onPointDragStart}
        onDragEnd={onDragEnd}
      />
    </SVG>
  );
}
