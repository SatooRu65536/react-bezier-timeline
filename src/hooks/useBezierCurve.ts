import {
  BezierCurve,
  DragEndHandler,
  DragHandler,
  HandleDragStartHandler,
  HandleType,
  Point,
  PointDragStartHandler,
  Position,
  ViewDragStartHandler,
} from '@/types';
import { useCallback, useState } from 'react';

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

      const { index } = selectElement;
      const point = bezierCurve.at(index);
      if (!point) {
        console.warn('Point not found');
        return;
      }

      const { initPos, initMousePos } = selectElement;
      const dx = (x - initMousePos.x) / ratioX;
      const dy = (y - initMousePos.y) / ratioY;
      const clonedBezierCurve = structuredClone(bezierCurve);

      if (selectElement.type === 'point') {
        clonedBezierCurve[index].position = {
          x: initPos.x + dx,
          y: initPos.y - dy,
        };
      } else if (selectElement.type === 'handle') {
        clonedBezierCurve[index][selectElement.handleType] = {
          x: initPos.x + dx,
          y: initPos.y - dy,
        };
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

  return {
    bezierCurve,
    setBezierCurve,
    onPointDragStart,
    onHandleDragStart,
    onViewDragStart,
    onDrag,
    onDragEnd,
  };
};
