import type { Meta, StoryObj } from "@storybook/react";
import BezierTimeline from ".";
import { BezierCurve } from "./types";

const meta = {
  title: "BezierTimeline",
  component: BezierTimeline,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof BezierTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const tmpBezierCurve: BezierCurve = [
  {
    position: { x: 0, y: 0 },
    handleR: { x: 100, y: 0 },
  },
  {
    position: { x: 100, y: 100 },
    // handleL: { x: 0, y: 0 },
  },
  {
    position: { x: 200, y: 100 },
  },
];

const width = 400;
const height = 200;

export const Primary: Story = {
  args: {
    bezierCurve: tmpBezierCurve,
    width,
    height,
    xRange: [0, width],
    yRange: [0, height],
  },
};
