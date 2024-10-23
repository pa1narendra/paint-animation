'use client';
import React, { useEffect, useRef } from 'react';
import useWindow from './useWindow';

interface Position {
  x: number;
  y: number;
}

export default function Scene() {
  const { dimension } = useWindow();
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const prevPos = useRef<Position | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dimension.width > 0 && init();
  }, [dimension]);

  const init = () => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        // Fill the canvas with black color
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, dimension.width, dimension.height);

        // Reset globalCompositeOperation to 'source-over' for drawing the text
        ctx.globalCompositeOperation = "destination-out";

        // // Create a gradient for the text
        // const gradient = ctx.createLinearGradient(0, 0, dimension.width, 0);
        // gradient.addColorStop(0, "red");
        // gradient.addColorStop(0.5, "yellow");
        // gradient.addColorStop(1, "blue");

        // // Set up the text properties
        // ctx.font = "30px Arial";
        // ctx.textAlign = "center";
        // ctx.fillStyle = gradient; // Apply the gradient to the text

        // // Add shadow to make the text pop
        // ctx.shadowColor = "rgba(0,0,0,0.5)";
        // ctx.shadowOffsetX = 2;
        // ctx.shadowOffsetY = 2;
        // ctx.shadowBlur = 5;

        

        // // Set the composite operation back to 'destination-out' for erasing
        // ctx.globalCompositeOperation = "destination-out";
      }
    }
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const handleMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY, movementX, movementY } = e;
    const noOfCircles = Math.max(Math.abs(movementX), Math.abs(movementY)) / 10;

    if (prevPos.current) {
      const { x, y } = prevPos.current;
      for (let i = 0; i < noOfCircles; i++) {
        const targetX = lerp(x, clientX, (1 / noOfCircles) * i);
        const targetY = lerp(y, clientY, (1 / noOfCircles) * i);
        draw(targetX, targetY, 50);
      }
    }
    prevPos.current = {
      x: clientX,
      y: clientY,
    };
  };

  const draw = (x: number, y: number, radius: number) => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {dimension.width === 0 && (
        <div className="absolute w-full h-full bg-black"></div>
      )}
      <canvas
        ref={canvas}
        onMouseMove={handleMouse}
        height={dimension.height}
        width={dimension.width}
      />
    </div>
  );
}
