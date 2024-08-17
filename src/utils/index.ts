import { BezierCurve } from "@/types";

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
export const getKeys = <T extends { [key: string]: unknown }>(
  obj: T,
): (keyof T)[] => {
  return Object.keys(obj);
};

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
  const ratioY = height / (yRange[1] - yRange[0]);
  const ratioX = width / (xRange[1] - xRange[0]);

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
