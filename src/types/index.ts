export interface Position {
  x: number;
  y: number;
}

export interface Point {
  handleL?: Position;
  position: Position;
  handleR?: Position;
}
export interface Id {
  id: number;
}

export type BezierCurveWithId = (Point & Id)[];
export type BezierCurve = Point[];

export type ViewRange = [number, number];

export type HandleType = keyof Pick<Point, 'handleL' | 'handleR'>;

export type ViewDragStartHandler = (mouseX: number, mouseY: number) => void;
export type PointDragStartHandler = (index: number, mouseX: number, mouseY: number) => void;
export type HandleDragStartHandler = (index: number, mouseX: number, mouseY: number, type: HandleType) => void;
export type DragHandler = (mouseX: number, mouseY: number) => void;
export type DragEndHandler = () => void;
export type AddPointHandler = (x: number, y: number, top: number, left: number) => void;
