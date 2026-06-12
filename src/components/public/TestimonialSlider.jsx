"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import TestimonialCard from "./TestimonialCard.jsx";

const SWIPE_THRESHOLD = 45;

export default function TestimonialSlider({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef(null);
  const hasMultiple = items.length > 1;

  if (!items.length) {
    return null;
  }

  function goTo(index) {
    setActiveIndex((index + items.length) % items.length);
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

  function cancelPointer() {
    dragStartX.current = null;
  }

  return (
    <div
      className="testimonial-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <span className="sr-only" aria-live="polite">
        Showing testimonial {activeIndex + 1} of {items.length}: {items[activeIndex].clientName}
      </span>
      <div
        className="testimonial-slider-frame"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerEnd}
        onPointerCancel={cancelPointer}
      >
        <div
          className="testimonial-slider-track"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {items.map((item, index) => (
            <div
              className="testimonial-slide"
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-hidden={index !== activeIndex}
              aria-label={`${index + 1} of ${items.length}`}
            >
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {hasMultiple ? (
        <div className="testimonial-slider-footer">
          <div className="testimonial-slider-position">
            <span aria-hidden="true">{String(activeIndex + 1).padStart(2, "0")}</span>
            <div className="testimonial-slider-dots">
              {items.map((item, index) => (
                <button
                  className={index === activeIndex ? "is-active" : ""}
                  type="button"
                  key={item.id}
                  onClick={() => goTo(index)}
                  aria-label={`Show testimonial ${index + 1} from ${item.clientName}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
            <span aria-hidden="true">{String(items.length).padStart(2, "0")}</span>
          </div>

          <div className="testimonial-slider-controls" aria-label="Testimonial slider controls">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous testimonial"
              title="Previous testimonial"
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next testimonial"
              title="Next testimonial"
            >
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
