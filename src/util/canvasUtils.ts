import { colorToString, isPainted, getSides, getLinePoints } from "./utils";
import type { Cell, Color, GridSize } from "./types";

export const drawPixel = (
	x: number,
	y: number,
	size: number,
	ctx: CanvasRenderingContext2D,
) => {
	ctx.fillRect(x * size, y * size, size, size);
};

export const drawCanvas = (
	canvas: HTMLCanvasElement,
	gridSize: GridSize,
	pixels: Color[][],
) => {
	const rect = canvas.getBoundingClientRect();
	const size = Math.min(rect.width, rect.height);
	const dpr = window.devicePixelRatio || 1;

	const width = size * dpr;
	const height = size * dpr;
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	const pixelSize = size / gridSize;

	ctx.clearRect(0, 0, size, size);

	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
			const pixel = pixels[y][x];
			ctx.fillStyle = isPainted(pixel)
				? colorToString(pixel)
				: (x + y) % 2 === 0
					? "#ffffff"
					: "#d9d9d9";
			drawPixel(x, y, pixelSize, ctx);
		}
	}

	ctx.beginPath();
	ctx.strokeStyle = "#767676";

	for (let i = 0; i <= gridSize; i++) {
		const pos = i * pixelSize;

		ctx.moveTo(pos, 0);
		ctx.lineTo(pos, size);

		ctx.moveTo(0, pos);
		ctx.lineTo(size, pos);
	}

	ctx.stroke();
};

export const drawPreviewSquare = (
	canvas: HTMLCanvasElement,
	gridSize: GridSize,
	start: Cell,
	curr: Cell,
	color: Color,
) => {
	const rect = canvas.getBoundingClientRect();
	const size = Math.min(rect.width, rect.height);
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const pixelSize = size / gridSize;
	const { left, right, top, bottom } = getSides(
		start.X,
		curr.X,
		start.Y,
		curr.Y,
	);
	const boundedLeft = Math.max(0, left);
	const boundedRight = Math.min(gridSize - 1, right);
	const boundedTop = Math.max(0, top);
	const boundedBottom = Math.min(gridSize - 1, bottom);

	if (boundedLeft > boundedRight || boundedTop > boundedBottom) return;

	ctx.fillStyle = colorToString(color);
	for (let X = boundedLeft; X <= boundedRight; X++) {
		drawPixel(X, boundedTop, pixelSize, ctx);
		drawPixel(X, boundedBottom, pixelSize, ctx);
	}

	for (let Y = boundedTop; Y <= boundedBottom; Y++) {
		drawPixel(boundedLeft, Y, pixelSize, ctx);
		drawPixel(boundedRight, Y, pixelSize, ctx);
	}
};

export const drawPreviewLine = (
	canvas: HTMLCanvasElement,
	gridSize: GridSize,
	start: Cell,
	curr: Cell,
	color: Color,
) => {
	const rect = canvas.getBoundingClientRect();
	const size = Math.min(rect.width, rect.height);
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const pixelSize = size / gridSize;
	const linePoints = getLinePoints(start.X, start.Y, curr.X, curr.Y);

	ctx.fillStyle = colorToString(color);
	linePoints.forEach((point) => {
		drawPixel(point.x, point.y, pixelSize, ctx);
	});
};
