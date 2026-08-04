import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { menuItems as fallbackMenuItems } from '../data/menuData.js';

// name -> { photo, photoFallback } — images are a frontend-only concern,
// so we keep them local and merge them onto whatever the API returns.
const photosByName = Object.fromEntries(
  fallbackMenuItems.map((item) => [item.name, { photo: item.photo, photoFallback: item.photoFallback }])
);

function mergePhotos(apiItems) {
  return apiItems.map((item) => {
    const photos = photosByName[item.name] || {};
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      price: Number(item.price),
      desc: item.description || '',
      featured: !!item.featured,
      photo: photos.photo || item.photo_url || '',
      photoFallback: photos.photoFallback || item.photo_url || '',
    };
  });
}

/**
 * Loads the menu from GET /api/menu-items. If the API is unreachable
 * (backend not running, no network), falls back to the static local
 * array in src/data/menuData.js so the site still works standalone.
 */
export function useMenuItems() {
  const [menuItems, setMenuItems] = useState(fallbackMenuItems);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api.getMenuItems()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(mergePhotos(data));
          setUsingFallback(false);
        } else {
          setMenuItems(fallbackMenuItems);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setMenuItems(fallbackMenuItems);
        setUsingFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { menuItems, loading, usingFallback };
}
