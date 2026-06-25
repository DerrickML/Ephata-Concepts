import { ExternalLink, Image as ImageIcon, PlayCircle } from "lucide-react";
import ArchImage from "./ArchImage.jsx";

export default function GalleryAlbumCard({ album, page }) {
  const images = Array.isArray(album.images) ? album.images.slice(0, 4) : [];
  const videoLinks = Array.isArray(album.videoLinks) ? album.videoLinks : [];
  const hasMedia = images.length || videoLinks.length;

  return (
    <article className="gallery-album-card">
      <div className={`gallery-album-preview preview-count-${images.length}`}>
        {images.length ? (
          images.map((image, index) => (
            <ArchImage
              key={`${album.id}-image-${index}`}
              src={image}
              alt={`${album.title} preview ${index + 1}`}
              className="gallery-album-image"
            />
          ))
        ) : (
          <div className="gallery-media-placeholder">
            <PlayCircle size={24} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="gallery-album-body">
        <p className="card-category">
          {[album.location, album.eventDate].filter(Boolean).join(" · ") || "Gallery Album"}
        </p>
        <h3>{album.title}</h3>
        {album.description ? <p>{album.description}</p> : null}
        <div className="gallery-media-meta">
          <span>
            <ImageIcon size={15} aria-hidden="true" />
            {images.length}/4 images
          </span>
          {videoLinks.length ? (
            <span>
              <PlayCircle size={15} aria-hidden="true" />
              {videoLinks.length} video{videoLinks.length === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
        <div className="gallery-album-actions">
          {album.externalAlbumUrl ? (
            <a className="text-link" href={album.externalAlbumUrl} target="_blank" rel="noreferrer">
              {page.externalLinkLabel || "Open Full Album"}
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          ) : null}
          {videoLinks.map((link, index) => (
            <a className="text-link subtle" href={link} target="_blank" rel="noreferrer" key={link}>
              {page.videoLinkLabel || "Watch Video"} {videoLinks.length > 1 ? index + 1 : ""}
            </a>
          ))}
        </div>
        {hasMedia && page.imageLimitNote ? <small>{page.imageLimitNote}</small> : null}
      </div>
    </article>
  );
}
