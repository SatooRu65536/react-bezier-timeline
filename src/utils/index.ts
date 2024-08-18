import { BezierCurve, ViewRange } from '@/types';

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

  const length = Math.floor((range[1] - range[0]) / step) + 1;
  return Array.from({ length }, (_, i) => {
    const value = diff + step * i;

    const label = (range[0] + value).toFixed(1);
    const position = height ? height - value * ratio : value * ratio;

    return { position, label };
  });
}
