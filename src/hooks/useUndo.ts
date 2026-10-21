import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { Color } from "../util/types";

const useUndo = (
	history: Color[][][],
	setHistory: Dispatch<SetStateAction<Color[][][]>>,
	setPixels: Dispatch<SetStateAction<Color[][]>>,
) => {
	useEffect(() => {
		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
				if (history.length > 0) {
					const hist = history.map((pixels) => [...pixels]);
					const pixelState = hist.pop();
					if (pixelState) {
						setPixels(pixelState);
						setHistory(hist);
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [history, setHistory, setPixels]);
};

export default useUndo;
