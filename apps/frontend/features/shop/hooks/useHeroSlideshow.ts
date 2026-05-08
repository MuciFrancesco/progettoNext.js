'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type HeroSlide = {
  readonly category: string;
  readonly slug: string;
  readonly label: string;
  readonly title: string;
  readonly subtitle: string;
  readonly imagePath: string;
};

type UseHeroSlideshowOptions = {
  readonly fallbackSlide: HeroSlide;
  readonly interval?: number;
};

/**
 * Gestisce lo slideshow hero: indice attivo, rotazione automatica,
 * navigazione manuale (prev/next). Reset quando cambia il numero di slide.
 */
export function useHeroSlideshow(slides: readonly HeroSlide[], options: UseHeroSlideshowOptions) {
  const { fallbackSlide, interval = 7000 } = options;

  const safeSlides = useMemo(
    () => (slides.length > 0 ? slides : [fallbackSlide]),
    [slides, fallbackSlide]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  // Reset slide index quando cambia il numero di slide
  useEffect(() => {
    setActiveIndex(0);
  }, [safeSlides.length]);

  // Rotazione automatica
  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const timer = globalThis.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length);
    }, interval);
    return () => globalThis.clearInterval(timer);
  }, [safeSlides.length, interval]);

  const activeSlide = safeSlides[activeIndex] ?? safeSlides[0];

  const goToPrevious = () =>
    setActiveIndex((current) => (current - 1 + safeSlides.length) % safeSlides.length);

  const goToNext = () => setActiveIndex((current) => (current + 1) % safeSlides.length);

  return {
    activeSlide,
    activeIndex,
    totalSlides: safeSlides.length,
    slideLabel: `${activeIndex + 1}/${safeSlides.length}`,
    goToPrevious,
    goToNext,
  } as const;
}
