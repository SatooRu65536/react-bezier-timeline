import {
  BezierCurve,
  DragEndHandler,
  DragHandler,
  HandleDragStartHandler,
  HandleType,
  PointDragStartHandler,
  Position,
  ViewDragStartHandler,
} from '@/types';
import { useCallback, useMemo, useState } from 'react';

interface SelectedHandle {
  type: 'handle';
  handleType: HandleType;
}
interface SelectedPoint {
  type: 'point';
}
interface SelectedView {
  type: 'view';
}
type SelectedElement = {
  index: number;
  initPos: Position;
  initMousePos: Position;
} & (SelectedHandle | SelectedPoint | SelectedView);

export interface BezierCurveProps {
  defaultBezierCurve?: BezierCurve;
  ratioX: number;
  ratioY: number;
}

export const useBezierCurve = ({ defaultBezierCurve, ratioX, ratioY }: BezierCurveProps) => {
  const [bezierCurve, setBezierCurve] = useState<BezierCurve>(defaultBezierCurve ?? []);
  const [selectElement, setSelectElement] = useState<SelectedElement>();

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
  const onViewDragStart: ViewDragStartHandler = useCallback((x: number, y: number) => {
    console.log('onViewDragStart', x, y);
  }, []);

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
      const dy = (y - initMousePos.y) / ratioY;

      // ドラッグ中の座標を更新
      const clonedBezierCurve = structuredClone(bezierCurve);
      if (selectElement.type === 'point') {
        clonedBezierCurve[index].position = {
          x: initPos.x + dx,
          y: initPos.y - dy,
        };
      } else if (selectElement.type === 'handle') {
        const x = initPos.x + dx;
        const y = initPos.y - dy;
        const isNear = Math.abs(x) < 10 && Math.abs(y) < 10;

        clonedBezierCurve[index][selectElement.handleType] = isNear ? { x: 0, y: 0 } : { x, y };
      }

      setBezierCurve(clonedBezierCurve);
    },
    [bezierCurve, ratioX, ratioY, selectElement],
  );
  /**
   * ドラッグ終了
   */
  const onDragEnd: DragEndHandler = useCallback(() => {
    setSelectElement(undefined);
  }, []);

  // 選択中か
  const isSelected = useMemo(() => selectElement !== undefined, [selectElement]);

  return {
    isSelected,
    bezierCurve,
    setBezierCurve,
    onPointDragStart,
    onHandleDragStart,
    onViewDragStart,
    onDrag,
    onDragEnd,
  };
};
