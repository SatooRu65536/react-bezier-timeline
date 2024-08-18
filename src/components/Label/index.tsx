import styles from './index.module.css';
import { LabelStyle } from '@/index';
import { ViewRange } from '@/types';
import { getLineLabels, getViewRatio } from '@/utils';
import { memo } from 'react';

type Props = LabelStyle & {
  width: number;
  height: number;
  xRange: ViewRange;
  yRange: ViewRange;
};

export const Label = memo(
  ({
    width,
    height,
    xRange,
    yRange,
    xStep = 50,
    yStep = 50,
    hidden,
    size = 12,
    color,
    xPosition = [],
    yPosition = [],
  }: Props) => {
    const [ratioX, ratioY] = getViewRatio(width, height, xRange, yRange);
    const xLineLabels = getLineLabels(xRange, xStep, ratioX); // 縦軸
    const yLineLabels = getLineLabels(yRange, yStep, ratioY, height); // 横軸

    const hiddenX = Array.isArray(hidden) ? hidden[0] : hidden;
    const hiddenY = Array.isArray(hidden) ? hidden[1] : hidden;

    return (
      <g className={styles.labels}>
        {yLineLabels.map((lineLabel, i) => (
          <g key={lineLabel.label}>
            {xPosition.includes('left') && (
              <text
                key={i}
                x={0}
                y={lineLabel.position + size / 2}
                fontSize={size}
                fill={color}
                style={{ display: hiddenX ? 'none' : 'block' }}
              >
                {lineLabel.label}
              </text>
            )}

            {xPosition.includes('right') && (
              <text
                key={i}
                x={width - 35}
                y={lineLabel.position + size / 2}
                fontSize={size}
                fill={color}
                style={{ display: hiddenX ? 'none' : 'block' }}
              >
                {lineLabel.label}
              </text>
            )}
          </g>
        ))}

        {xLineLabels.map((lineLabel, i) => (
          <g key={lineLabel.label}>
            {yPosition.includes('top') && (
              <text
                key={i}
                x={lineLabel.position}
                y={size}
                fontSize={size}
                fill={color}
                style={{ display: hiddenY ? 'none' : 'block' }}
              >
                {lineLabel.label}
              </text>
            )}
            {yPosition.includes('bottom') && (
              <text
                key={i}
                x={lineLabel.position}
                y={height}
                fontSize={size}
                fill={color}
                style={{ display: hiddenY ? 'none' : 'block' }}
              >
                {lineLabel.label}
              </text>
            )}
          </g>
        ))}
      </g>
    );
  },
);
