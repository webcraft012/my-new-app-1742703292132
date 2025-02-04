import { DRAG_AND_DROP_PADDING } from "@webcraft/types";

/**
 * Calculate the container padding based on the dragging state and selected padding.
 *
 * @param {boolean} isDragging - Indicates whether the container is currently being dragged.
 * @param {number} [selectedPadding] - The padding value selected by the user. If not provided, defaults to 0 when dragging.
 * @returns {number | undefined} - The calculated container padding. If dragging, returns the sum of selected padding and drag-and-drop padding. Otherwise, returns the selected padding.
 */
export const getContainerPadding = (
  isDragging: boolean,
  selectedPadding?: number,
): number | undefined => {
  // Compute the padding to add, the minimum should be DRAG_AND_DROP_PADDING, so add 8 if the selected padding is less than 8
  const paddingToAdd = Math.max(DRAG_AND_DROP_PADDING, selectedPadding ?? 0);

  return isDragging ? paddingToAdd : selectedPadding;
};
