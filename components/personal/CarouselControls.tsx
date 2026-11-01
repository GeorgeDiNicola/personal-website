import type { ReactNode } from "react";

type CarouselControlsProps = {
  itemName: string;
  activeIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  trailingAction?: ReactNode;
};

/** Keeps carousel navigation in a consistent row above its content. */
export function CarouselControls({
  itemName,
  activeIndex,
  totalItems,
  onPrevious,
  onNext,
  trailingAction,
}: CarouselControlsProps) {
  const label = itemName.toLowerCase();

  return (
    <div className="personal-carousel-controls" role="group" aria-label={`${itemName} navigation`}>
      <p className="personal-carousel-count site-text-static" role="status" aria-live="polite" aria-atomic="true">
        {itemName} {activeIndex + 1} of {totalItems}
      </p>
      <div className="personal-carousel-actions">
        <button type="button" onClick={onPrevious} aria-label={`Previous ${label}`} disabled={totalItems < 2}>
          <CarouselArrow direction="left" />
        </button>
        <button type="button" onClick={onNext} aria-label={`Next ${label}`} disabled={totalItems < 2}>
          <CarouselArrow direction="right" />
        </button>
        {trailingAction}
      </div>
    </div>
  );
}

function CarouselArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "m10 3.5-4.5 4.5 4.5 4.5" : "m6 3.5 4.5 4.5-4.5 4.5"} />
    </svg>
  );
}
