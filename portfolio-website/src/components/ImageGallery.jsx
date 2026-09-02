import React, { useState } from 'react';
import Lightbox from './Lightbox';
import '../styles/ImageGallery.css';

/**
 * A row of thumbnails that open in a Lightbox. images: [{ src, alt }]
 */
export default function ImageGallery({ images }) {
  const [index, setIndex] = useState(null);
  if (!images || images.length === 0) return null;

  return (
    <>
      <ul className="image-gallery">
        {images.map((img, i) => (
          <li key={img.src} className="image-gallery__item">
            <button
              type="button"
              className="image-gallery__button"
              onClick={() => setIndex(i)}
              aria-label={`Open image${img.alt ? `: ${img.alt}` : ''}`}
            >
              <img
                src={img.src}
                alt={img.alt || ''}
                width="160"
                height="108"
                loading="lazy"
                className="image-gallery__image"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </>
  );
}
