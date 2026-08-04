import { useState } from 'react';

/**
 * Renders a dish photo from the local src/assets bundle. If that file
 * is missing or failed to download (see scripts/download-images.mjs),
 * it automatically swaps to the remote fallback URL so the image never
 * shows broken.
 */
export default function DishImage({ item, alt, className, ...rest }) {
  const [src, setSrc] = useState(item.photo);
  const [triedFallback, setTriedFallback] = useState(false);

  function handleError() {
    if (!triedFallback && item.photoFallback) {
      setTriedFallback(true);
      setSrc(item.photoFallback);
    }
  }

  return (
    <img
      src={src}
      alt={alt || item.name}
      className={className}
      loading="lazy"
      onError={handleError}
      {...rest}
    />
  );
}
