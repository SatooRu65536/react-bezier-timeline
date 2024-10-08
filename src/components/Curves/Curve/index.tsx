import { LineStyle } from '@/index';
import styles from './index.module.css';
import { Point } from '@/types';
import { memo } from 'react';

type Props = {
  left: Point;
  right: Point;
} & LineStyle;

export const Curve = memo(({ left, right, color, width }: Props) => {
  // 開始
  const sx = left.position.x;
  const sy = left.position.y;

  // 終点
  const ex = right.position.x;
  const ey = right.position.y;

  // 制御点(ハンドル)の位置 - 開始点側
  const cx1 = sx + (left.handleR?.x ?? 0);
  const cy1 = sy - (left.handleR?.y ?? 0);

  // 制御点(ハンドル)の位置 - 終点側
  const cx2 = ex + (right.handleL?.x ?? 0);
  const cy2 = ey - (right.handleL?.y ?? 0);

  // ベジェ曲線のパス
  const d = `M ${sx},${sy} C ${cx1},${cy1} ${cx2},${cy2} ${ex},${ey}`;

  return <path className={styles.path} d={d} stroke={color} strokeWidth={width} />;
});
