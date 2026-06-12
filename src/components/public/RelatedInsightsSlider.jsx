"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import InsightCard from "./InsightCard.jsx";

const SWIPE_THRESHOLD = 45;

export default function RelatedInsightsSlider({ items = [] }) {
  const dragStartX = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = items.length > 1;

  if (!items.length) return null;

  function goTo(index) {
    const nextIndex = (index + items.length) % items.length;
    setActiveIndex(nextIndex);
  }

  function handlePointerDown(event) {
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerEnd(event) {
    if (dragStartX.current === null || !hasMultiple) return;
    const distance = event.clientX - dragStartX.current;
    dragStartX.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    goTo(distance > 0 ? activeIndex - 1 : activeIndex + 1);
  }

  function handleKeyDown(event) {
    if (!hasMultiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  }

  return (
    <div
      className="related-insights-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Related insights"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className="related-insights-frame"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerEnd}
        onPointerCancel={() => { dragStartX.current = null; }}
      >
        <div
          className="related-insights-track"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {items.map((item, index) => (
            <div
              className="related-insight-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
              aria-hidden={index !== activeIndex}
              key={item.id}
            >
              <InsightCard post={item} headingLevel="h3" compact />
            </div>
          ))}
        </div>
      </div>
      {hasMultiple ? (
        <div className="related-insights-footer">
          <span aria-live="polite">{activeIndex + 1} / {items.length}</span>
          <div className="related-insights-controls" aria-label="Related insight slider controls">
            <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous related insight" title="Previous related insight">
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next related insight" title="Next related insight">
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
