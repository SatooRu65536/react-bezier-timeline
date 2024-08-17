export interface Position {
  x: number;
  y: number;
}

export interface Point {
  handleL?: Position;
  position: Position;
  handleR?: Position;
}

export type BezierCurve = Point[];

export type ViewRange = [number, number];
