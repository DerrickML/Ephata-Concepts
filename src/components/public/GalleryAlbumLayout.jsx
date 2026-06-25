"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GalleryAlbumCard from "./GalleryAlbumCard.jsx";

const BATCH_SIZE = 6;

export default function GalleryAlbumLayout({ albums, page, displayStyle }) {
  const sentinelRef = useRef(null);
  const isInfinite = displayStyle === "infinite-scroll";
  const [visibleCount, setVisibleCount] = useState(isInfinite ? BATCH_SIZE : albums.length);
  const visibleAlbums = useMemo(
    () => albums.slice(0, isInfinite ? visibleCount : albums.length),
    [albums, isInfinite, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(isInfinite ? BATCH_SIZE : albums.length);
  }, [albums.length, isInfinite]);

  useEffect(() => {
    if (!isInfinite || !sentinelRef.current) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleCount((current) => Math.min(current + BATCH_SIZE, albums.length));
      }
    }, { rootMargin: "360px" });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [albums.length, isInfinite]);

  return (
    <>
      <div className={`gallery-album-layout gallery-style-${displayStyle}`}>
        {visibleAlbums.map((album) => (
          <GalleryAlbumCard album={album} page={page} key={album.id} />
        ))}
      </div>
      {isInfinite && visibleCount < albums.length ? (
        <div className="gallery-scroll-sentinel" ref={sentinelRef}>
          <button
            type="button"
            className="btn-outline-brand"
            onClick={() => setVisibleCount((current) => Math.min(current + BATCH_SIZE, albums.length))}
          >
            Load More Albums
          </button>
        </div>
      ) : null}
    </>
  );
}
