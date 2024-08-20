import type { Meta, StoryObj } from '@storybook/react';
import BezierTimeline from '.';
import { BezierCurve } from './types';

const meta = {
  title: 'BezierTimeline',
  component: BezierTimeline,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof BezierTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const tmpBezierCurve: BezierCurve = [
  {
    position: { x: 0, y: 0 },
    handleR: { x: 50, y: 50 },
  },
  {
    handleL: { x: -50, y: -20 },
    position: { x: 50, y: 100 },
  },
  {
    position: { x: 200, y: 200 },
  },
];

const width = 400;
const height = 200;

export const Default: Story = {
  args: {
    defaultBezierCurve: tmpBezierCurve,
    width,
    height,
  },
};

export const CustomRange: Story = {
  args: {
    defaultBezierCurve: tmpBezierCurve,
    width,
    height,
    defaultXRange: [-100, 300],
    defaultYRange: [-100, 300],
  },
};

export const CustomPointStyle: Story = {
  args: {
    defaultBezierCurve: tmpBezierCurve,
    width,
    height,
    lineStyle: {
      color: '#EBDDB4',
      width: 10,
    },
  },
};

export const CustomLineStyle: Story = {
  args: {
    defaultBezierCurve: tmpBezierCurve,
    width,
    height,
    lineStyle: {
      color: '#EBDDB4',
      width: 10,
    },
  },
};
