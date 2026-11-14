import { useEffect, type RefObject } from 'react';

/**
 * Plays a muted background video only while it is on screen, the tab is visible and motion is
 * allowed; otherwise it is paused. Nothing downloads under reduced motion or Save-Data, where the
 * poster stands in. No React state: the effect drives the element directly.
 */
export function useAmbientVideo(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    let onScreen = false;
    // React sets only the muted property; Safari's autoplay check reads the attribute.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');

    const sync = () => {
      if (onScreen && !document.hidden && !reduced.matches && !saveData) {
        // A browser may refuse play() before any data has loaded: fetch it and try again once it
        // can play. If it is still refused (iOS Low Power Mode, say), the poster stays up.
        video.play().catch(() => {
          video.preload = 'auto';
          if (video.readyState === 0) video.load();
          video.addEventListener('canplay', retry, { once: true });
        });
      } else {
        video.pause();
      }
    };

    const retry = () => {
      if (onScreen && !document.hidden && !reduced.matches && !saveData) video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
      video.removeEventListener('canplay', retry);
      video.pause();
    };
  }, [videoRef]);
}
