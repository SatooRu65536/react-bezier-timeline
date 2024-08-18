import { BezierCurve, Point, ViewRange } from '@/types';

/**
 * 配列をペアにして返す
 *
 * ex) [1, 2, 3, 4] => [[1, 2], [2, 3], [3, 4]]
 *
 * @param {T[]} arr - 配列
 * @returns {[T, T][]} - ペアの配列
 * @template T - 配列の要素の型
 */
export function mapPairs<T>(arr: T[]): [T, T][] {
  const resArr: [T, T][] = [];

  for (let i = 0; i < arr.length - 1; i++) resArr.push([arr[i], arr[i + 1]]);

  return resArr;
}

/**
 * 型安全なObject.keys
 * @param obj - オブジェクト
 * @returns - オブジェクトのキーの配列
 */
export const getKeys = <T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
  return Object.keys(obj);
};

/**
 * 画面座標と実座標の比率を取得する
 * @param {number} width - 画面の幅
 * @param {number} height - 画面の高さ
 * @param {ViewRange} xRange - x軸の範囲
 * @param {ViewRange} yRange - y軸の範囲
 * @returns {[number, number]} - x, yの比率
 */
export function getViewRatio(width: number, height: number, xRange = [0, width], yRange = [0, height]) {
  const ratioY = height / (yRange[1] - yRange[0]);
  const ratioX = width / (xRange[1] - xRange[0]);

  return [ratioX, ratioY];
}

/**
 * ベジェ曲線の点を描画用の座標に変換する
 *
 */
export function toDrawPoints(
  bezierCurve: BezierCurve,
  width: number,
  height: number,
  xRange = [0, width],
  yRange = [0, height],
): BezierCurve {
  const [ratioX, ratioY] = getViewRatio(width, height, xRange, yRange);

  return bezierCurve.map((point) => ({
    position: {
      x: (point.position.x - xRange[0]) * ratioX,
      y: height - (point.position.y - yRange[0]) * ratioY,
    },
    handleL: point.handleL
      ? {
          x: point.handleL.x * ratioX,
          y: point.handleL.y * ratioY,
        }
      : undefined,
    handleR: point.handleR
      ? {
          x: point.handleR.x * ratioX,
          y: point.handleR.y * ratioY,
        }
      : undefined,
  }));
}

/**
 * グリッドの線とラベルを取得する
 * @param {ViewRange} range - 範囲
 * @param {number} step - 間隔
 * @returns { label: string; position: number }[] - 線の座標とラベルの配列
 */
export function getLineLabels(
  range: ViewRange,
  step: number,
  ratio: number,
  height?: number,
): { label: string; position: number }[] {
  const diff = (step - range[0]) % step;

  const length = Math.floor((range[1] - range[0]) / step) + 2;
  return Array.from({ length }, (_, i) => {
    const value = diff + step * i;

    const label = (range[0] + value).toFixed(1);
    const position = height ? height - value * ratio : value * ratio;

    return { position, label };
  });
}

function getLeftRightPoint(x: number, bezierCurve: BezierCurve): [Point, Point, number] | undefined {
  if (bezierCurve.length === 0) return undefined;

  const { p: left, i: index } = bezierCurve.reduce(
    (acc, point, i) => {
      const diff = x - point.position.x;
      const minDiff = x - acc.p.position.x;
      if (diff >= 0 && minDiff > diff) return { p: bezierCurve[i], i };
      return acc;
    },
    { p: bezierCurve[0], i: 0 },
  );

  const right = bezierCurve[index + 1] ?? left;
  if (!right) return undefined;

  return [left, right, index];
}

function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

/**
 * ベジェ曲線の y 座標を取得する
 * @param {number} x - x 座標
 * @param {BezierCurve} bezierCurve - ベジェ曲線
 * @returns {number | undefined} - y 座標
 */
export function getBezierY(x: number, bezierCurve: BezierCurve): { y: number; index: number } | undefined {
  // 指定された x に対応する左と右のポイントを取得
  const points = getLeftRightPoint(x, bezierCurve);
  if (!points) return undefined;

  const [left, right, index] = points;

  // 左側のポイントのハンドル位置を計算
  const p0 = left.position;
  const p1 = left.handleR ? { x: p0.x + left.handleR.x, y: p0.y + left.handleR.y } : p0;
  // 右側のポイントのハンドル位置を計算
  const p3 = right.position;
  const p2 = right.handleL ? { x: p3.x + right.handleL.x, y: p3.y + right.handleL.y } : p3;

  // ニュートン法やバイナリサーチで t を求めて y を返す
  let t = 0.5;
  let lower = 0;
  let upper = 1;

  for (let j = 0; j < 20; j++) {
    const xt = cubicBezier(t, p0.x, p1.x, p2.x, p3.x);
    if (Math.abs(xt - x) < 0.001) {
      return { y: cubicBezier(t, p0.y, p1.y, p2.y, p3.y), index };
    }
    if (xt < x) {
      lower = t;
    } else {
      upper = t;
    }
    t = (lower + upper) / 2;
  }

  return { y: cubicBezier(t, p0.y, p1.y, p2.y, p3.y), index };
}
