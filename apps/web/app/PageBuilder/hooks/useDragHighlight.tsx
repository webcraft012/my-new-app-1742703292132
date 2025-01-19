import { useState } from "react";

export const useDragHighlight = () => {
  const [highlightSide, setHighlightSide] = useState<"left" | "right" | null>(
    null,
  ); // "left" or "right"

  const handleDragOver = (event, containerRef) => {
    event.preventDefault();
    if (!containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;

    if (offsetX < rect.width * 0.1) {
      // Left padding (10% of the width)
      setHighlightSide("left");
    } else if (offsetX > rect.width * 0.9) {
      // Right padding (last 10% of the width)
      setHighlightSide("right");
    } else {
      setHighlightSide(null);
    }
  };

  const handleDragLeave = () => {
    setHighlightSide(null); // Reset on leave
  };

  return {
    highlightSide,
    handleDragOver,
    handleDragLeave,
  };
};
