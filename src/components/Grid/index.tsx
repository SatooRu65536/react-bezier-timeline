import { GridStyle } from '@/index';
import { ViewRange } from '@/types';
import { getLines, getViewRatio } from '@/utils';
import { memo } from 'react';

type Props = GridStyle & {
  width: number;
  height: number;
  xRange: ViewRange;
  yRange: ViewRange;
};

export const Grid = memo(
  ({ width, height, xRange, yRange, xStep: xStep_, yStep: yStep_, hidden, color, weight, opacity }: Props) => {
    const xStep = xStep_ ?? 50;
    const yStep = yStep_ ?? 50;

    const [ratioX, ratioY] = getViewRatio(width, height, xRange, yRange);
    const xLines = getLines(xRange, xStep, ratioX); // 縦軸
    const yLines = getLines(yRange, yStep, ratioY).map((y) => height - y); // 横軸

    return (
      <g>
        {hidden !== true && (
          <>
            <g>
              {xLines.map((x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1={yRange[0]}
                  x2={x}
                  y2={yRange[1]}
                  stroke={color}
                  strokeWidth={weight}
                  style={{ opacity }}
                />
              ))}
            </g>
            <g>
              {yLines.map((y, i) => (
                <line
                  key={i}
                  x1={xRange[0]}
                  y1={y}
                  x2={xRange[1]}
                  y2={y}
                  stroke={color}
                  strokeWidth={weight}
                  style={{ opacity }}
                />
              ))}
            </g>
          </>
        )}
      </g>
    );
  },
);
