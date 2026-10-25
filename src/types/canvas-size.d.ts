// SPDX-License-Identifier: GPL-2.0-or-later

declare module "canvas-size" {
  interface CanvasSizeResult {
    width: number;
    height: number;
    testTime: number;
    totalTime: number;
    success: boolean;
  }
  const canvasSize: {
    maxArea(options?: { max?: number; min?: number; step?: number }): Promise<CanvasSizeResult>;
    maxHeight(options?: { max?: number; min?: number; step?: number }): Promise<CanvasSizeResult>;
    maxWidth(options?: { max?: number; min?: number; step?: number }): Promise<CanvasSizeResult>;
  };
  export default canvasSize;
}
