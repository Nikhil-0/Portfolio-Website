import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { navLinks } from '../data/nav';

const FALLBACK_TITLE = 'Nikhil Madeti';

/**
 * Sets document.title based on the current route (from data/nav.js).
 * Also scrolls to the top on navigation, unless the URL has a hash anchor.
 */
export function usePageTitle() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const match = navLinks.find((link) => link.to === pathname);
    document.title = match?.title || FALLBACK_TITLE;
  }, [pathname]);

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);
}
