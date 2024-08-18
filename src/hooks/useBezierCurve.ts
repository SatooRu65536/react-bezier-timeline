import {
  AddPointHandler,
  BezierCurve,
  DragEndHandler,
  DragHandler,
  HandleDragStartHandler,
  HandleType,
  PointDragStartHandler,
  Position,
  ViewDragStartHandler,
  ViewRange,
} from '@/types';
import { getBezierY, getViewRatio } from '@/utils';
import { useCallback, useMemo, useState } from 'react';

interface SelectedHandle {
  type: 'handle';
  index: number;
  handleType: HandleType;
  initPos: Position;
}
interface SelectedPoint {
  type: 'point';
  index: number;
  initPos: Position;
}
interface SelectedView {
  type: 'view';
  initXRange: ViewRange;
  initYRange: ViewRange;
}
type SelectedElement = {
  initMousePos: Position;
} & (SelectedHandle | SelectedPoint | SelectedView);

export interface BezierCurveProps {
  defaultBezierCurve?: BezierCurve;
  width: number;
  height: number;
  defaultXRange: ViewRange;
  defaultYRange: ViewRange;
  isMetaKeyDown: boolean;
}

export const useBezierCurve = ({
  defaultBezierCurve,
  width,
  height,
  defaultXRange,
  defaultYRange,
  isMetaKeyDown,
}: BezierCurveProps) => {
  const [bezierCurve, setBezierCurve] = useState<BezierCurve>(defaultBezierCurve ?? []);
  const [selectElement, setSelectElement] = useState<SelectedElement>();

  const [xRange, setXRange] = useState<ViewRange>(defaultXRange);
  const [yRange, setYRange] = useState<ViewRange>(defaultYRange);

  const [ratioX, ratioY] = useMemo(
    () => getViewRatio(width, height, defaultXRange, defaultYRange),
    [defaultXRange, defaultYRange, height, width],
  );

  /**
   * ポイントを追加する
   *
   * @param {number} x - x座標
   */
  const handleAddPoint: AddPointHandler = useCallback(
    (mouseX: number, mouseY: number) => {
      // mouseX, mouseY を実座標に変換
      const x = xRange[0] + mouseX / ratioX;
      const y = yRange[0] + (height - mouseY) / ratioY;

      const r = getBezierY(x, bezierCurve);
      if (r === undefined) {
        console.warn('Out of range');
        return;
      }
      const { index } = r;
      const newPoint: Position = { x, y };
      const clonedBezierCurve = structuredClone(bezierCurve);

      const prev = clonedBezierCurve.slice(0, index + 1);
      const next = clonedBezierCurve.slice(index + 1);
      setBezierCurve([...prev, { position: newPoint }, ...next]);
    },
    [bezierCurve, height, ratioX, ratioY, xRange, yRange],
  );

  /**
   * ポイントのドラッグ開始
   *
   * @param {number} index ドラッグするポイントのインデックス
   * @param {number} x ドラッグ開始時のマウスのx座標
   * @param {number} y ドラッグ開始時のマウスのy座標
   */
  const onPointDragStart: PointDragStartHandler = useCallback(
    (index: number, x: number, y: number) => {
      const point = bezierCurve.at(index);
      if (!point) {
        console.warn('Point not found');
        return;
      }

      const initPos = point.position;
      const initMousePos = { x, y };
      setSelectElement({ type: 'point', index, initPos, initMousePos });
    },
    [bezierCurve],
  );

  /**
   * ハンドルのドラッグ開始
   */
  const onHandleDragStart: HandleDragStartHandler = useCallback(
    (index: number, x: number, y: number, handleType: HandleType) => {
      const point = bezierCurve.at(index);
      if (!point) {
        console.warn('Point not found');
        return;
      }

      const initMousePos = { x, y };
      const handle = point[handleType];
      if (handle) {
        // ハンドルが存在する場合
        const initPos = handle;
        setSelectElement({ type: 'handle', index, handleType, initPos, initMousePos });
      } else {
        // ハンドルが存在しない場合
        const initPos = point.position;
        setSelectElement({ type: 'handle', index, handleType, initPos, initMousePos });
      }
    },
    [bezierCurve],
  );

  /**
   * ビューのドラッグ開始
   *
   * @param {number} x ドラッグ開始時のマウスのx座標
   * @param {number} y ドラッグ開始時のマウスのy座標
   */
  const onViewDragStart: ViewDragStartHandler = useCallback(
    (x: number, y: number) => {
      const initMousePos = { x, y };
      const initXRange = structuredClone(xRange);
      const initYRange = structuredClone(yRange);
      setSelectElement({ type: 'view', initMousePos, initXRange, initYRange });
    },
    [xRange, yRange],
  );

  /**
   * ドラッグ中
   *
   * @param {number} index ドラッグしているポイントのインデックス
   * @param {number} x ドラッグ中のマウスのx座標
   * @param {number} y ドラッグ中のマウスのy座標
   */
  const onDrag: DragHandler = useCallback(
    (x: number, y: number) => {
      if (!selectElement) return;

      if (selectElement.type === 'view') {
        const { initMousePos } = selectElement;
        const dx = (x - initMousePos.x) / ratioX;
        const dy = (y - initMousePos.y) / ratioY;

        const { initXRange, initYRange } = selectElement;
        setXRange([initXRange[0] - dx, initXRange[1] - dx]);
        setYRange([initYRange[0] + dy, initYRange[1] + dy]);
        return;
      }

      // ドラッグ中の要素を取得
      const { index } = selectElement;
      const point = bezierCurve.at(index);
      if (!point) {
        console.warn('Point not found');
        return;
      }

      // ドラッグ中の座標を計算
      const { initPos, initMousePos } = selectElement;
      const dx = (x - initMousePos.x) / ratioX;
      const dy = -(y - initMousePos.y) / ratioY;

      // ドラッグ中の座標を更新
      const clonedBezierCurve = structuredClone(bezierCurve);
      if (selectElement.type === 'point' && !isMetaKeyDown) {
        // ポイントを動かす
        clonedBezierCurve[index].position = {
          x: initPos.x + dx,
          y: initPos.y + dy,
        };
      } else if (selectElement.type === 'point') {
        // 両端のハンドルを動かす
        const handleR: Position = { x: dx, y: dy };
        const handleL: Position = { x: -dx, y: -dy };
        clonedBezierCurve[index] = { position: initPos, handleL, handleR };
      } else if (selectElement.type === 'handle') {
        const x = initPos.x + dx;
        const y = initPos.y + dy;

        const isNear = Math.abs(x) < 10 && Math.abs(y) < 10;
        if (isNear) delete clonedBezierCurve[index][selectElement.handleType];
        else clonedBezierCurve[index][selectElement.handleType] = { x, y };
      }

      setBezierCurve(clonedBezierCurve);
    },
    [bezierCurve, isMetaKeyDown, ratioX, ratioY, selectElement],
  );
  /**
   * ドラッグ終了
   */
  const onDragEnd: DragEndHandler = useCallback(() => {
    setSelectElement(undefined);
  }, []);

  // 選択中か
  const isSelected = useMemo(() => !!selectElement && selectElement.type !== 'view', [selectElement]);

  return {
    isSelected,
    bezierCurve,
    xRange,
    yRange,
    handleAddPoint,
    setBezierCurve,
    onPointDragStart,
    onHandleDragStart,
    onViewDragStart,
    onDrag,
    onDragEnd,
  };
};
