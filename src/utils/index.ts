import { BezierCurveWithId, Point, Position, ViewRange } from '@/types';

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
 * Point が一致するかどうかを判定する
 *
 * @param {Point} point1
 * @param {Point} point2
 * @returns boolean
 */
export function deepEqPoints(point1: Point, point2: Point): boolean {
  const positionsEqual = (pos1?: Position, pos2?: Position) => {
    if (!pos1 && !pos2) return true;
    if (!pos1 || !pos2) return false;
    return pos1.x === pos2.x && pos1.y === pos2.y;
  };

  return (
    positionsEqual(point1.handleL, point2.handleL) &&
    positionsEqual(point1.position, point2.position) &&
    positionsEqual(point1.handleR, point2.handleR)
  );
}

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
  bezierCurve: BezierCurveWithId,
  width: number,
  height: number,
  xRange = [0, width],
  yRange = [0, height],
): BezierCurveWithId {
  const [ratioX, ratioY] = getViewRatio(width, height, xRange, yRange);

  return bezierCurve.map((point) => ({
    id: point.id,
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

function getLeftRightPoint(x: number, bezierCurve: BezierCurveWithId): [Point, Point, number] | undefined {
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
 * @param {BezierCurveWithId} bezierCurve - ベジェ曲線
 * @returns {number | undefined} - y 座標
 */
export function getBezierY(x: number, bezierCurve: BezierCurveWithId): { y: number; index: number } | undefined {
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

interface DiffPoint {
  left?: Point;
  target: Point;
  targetBefore: Point;
  right?: Point;
}

/**
 * ベジェ曲線をタイムラインの形式に修正する
 *
 * - x座標を左右のポイントの間に収める
 * - ハンドルが隣のポイントを超えない
 * - ハンドルは反対方向を向かない
 *
 * @param {BezierCurveWithId} target - 対象のベジェ曲線
 * @param {BezierCurveWithId} before - 変更前のベジェ曲線
 * @returns {BezierCurveWithId} - 修正後のベジェ曲線
 */
export function adjustBezierCurve(target: BezierCurveWithId, before: BezierCurveWithId): BezierCurveWithId {
  const cloned = structuredClone(target);

  // 差分を取得
  const init: DiffPoint[] = [];
  const diffPoints: DiffPoint[] = cloned.reduce((diff, point, i) => {
    const beforePoint = before.find((p) => p.id === point.id);

    // 新規追加 または 変更がない場合
    if (!beforePoint || deepEqPoints(point, beforePoint)) return diff;

    const left = cloned.at(i - 1);
    const right = cloned.at(i + 1);

    const diffPoint: DiffPoint = {
      left,
      target: point,
      targetBefore: beforePoint,
      right,
    };
    return [...diff, diffPoint];
  }, init);

  diffPoints.forEach(({ left, target, targetBefore, right }) => {
    // x座標を左右のポイントの間に収める
    if (left && left.position.x >= target.position.x) target.position.x = left.position.x;
    if (right && right.position.x <= target.position.x) target.position.x = right.position.x;

    // 左右のポイントのハンドル位置を修正
    if (left && left.handleR) {
      const leftPointHandleR = left.position.x + left.handleR.x;
      // 左側のポイントがtargetを超えない
      if (leftPointHandleR > target.position.x) {
        left.handleR.x = target.position.x - left.position.x;
      }
    }
    if (right && right.handleL) {
      const rightPointHandleL = right.position.x + right.handleL.x;
      // 右側のポイントがtargetを超えない
      if (rightPointHandleL < target.position.x) {
        right.handleL.x = target.position.x - right.position.x;
      }
    }

    // 新規追加の場合はハンドルはない
    if (!targetBefore) return;

    if (left && target.handleL) {
      // 左側のハンドルが隣のポイントを超えない
      const handleLeftX = target.position.x + target.handleL.x;
      if (handleLeftX < left.position.x) {
        target.handleL.x = left.position.x - target.position.x;
      }
      // 左側のハンドルが右側を向かない
      if (handleLeftX > target.position.x) {
        target.handleL.x = 0;
      }
    }

    if (right && target.handleR) {
      // 右側のハンドルが隣のポイントを超えない
      const handleRightX = target.position.x + target.handleR.x;
      if (handleRightX > right.position.x) {
        target.handleR.x = right.position.x - target.position.x;
      }
      // 右側のハンドルが左側を向かない
      if (handleRightX < target.position.x) {
        target.handleR.x = 0;
      }
    }
  });

  return cloned;
}
