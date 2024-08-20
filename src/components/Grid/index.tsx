import { GridStyle } from '@/index';
import { ViewRange } from '@/types';
import { getLineLabels, getViewRatio } from '@/utils';
import { memo } from 'react';

type Props = GridStyle & {
  width: number;
  height: number;
  xRange: ViewRange;
  yRange: ViewRange;
};

export const Grid = memo(
  ({ width, height, xRange, yRange, xStep = 50, yStep = 50, hidden, color, weidth, opacity }: Props) => {
    const [ratioX, ratioY] = getViewRatio(width, height, xRange, yRange);
    const xLineLabels = getLineLabels(xRange, xStep, ratioX); // 縦軸
    const yLineLabels = getLineLabels(yRange, yStep, ratioY, height); // 横軸

    return (
      <g>
        {hidden !== true && (
          <>
            <g>
              {xLineLabels.map((x, i) => (
                <line
                  key={i}
                  x1={x.position}
                  y1={0}
                  x2={x.position}
                  y2={height}
                  stroke={color}
                  strokeWidth={weidth}
                  style={{ opacity }}
                />
              ))}
            </g>
            <g>
              {yLineLabels.map((y, i) => (
                <line
                  key={i}
                  x1={0}
                  y1={y.position}
                  x2={width}
                  y2={y.position}
                  stroke={color}
                  strokeWidth={weidth}
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
