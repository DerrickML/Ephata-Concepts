import Image from "next/image";
import { resolveImageSource } from "@/lib/uploadUrls.js";

export default function ArchImage({ src, defaultSrc, alt, className = "", priority = false }) {
  const resolvedSrc = src || defaultSrc;
  const imageSource = resolveImageSource(resolvedSrc);

  if (!imageSource.src) {
    return (
      <div className={`arch-image arch-placeholder ${className}`} aria-label={alt || "Event image placeholder"}>
        <div className="arch-line" />
        <div className="step-mark">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className={`arch-image ${className}`}>
      {imageSource.remote ? (
        <img src={imageSource.src} alt={alt || ""} loading={priority ? "eager" : "lazy"} />
      ) : (
        <Image
          src={imageSource.src}
          alt={alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          priority={priority}
        />
      )}
    </div>
  );
}
