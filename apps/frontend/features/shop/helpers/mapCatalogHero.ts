import { resolveProductImageSrc } from '@/lib/shop/format';

type HeroSlide = {
  readonly title: string;
  readonly subtitle: string;
  readonly label: string;
  readonly imagePath: string;
};

type ActiveHero = {
  readonly activeSlide: HeroSlide;
  readonly slideLabel: string;
};

type HeroData = {
  readonly title: string;
  readonly subtitle: string;
  readonly eyebrow: string;
  readonly imageSrc: string;
  readonly slideLabel: string;
};

/** Costruisce l'oggetto hero per ProductCatalog partendo dallo slideshow hook. */
export function mapCatalogHero(activeHero: ActiveHero): HeroData {
  return {
    title: activeHero.activeSlide.title,
    subtitle: activeHero.activeSlide.subtitle,
    eyebrow: activeHero.activeSlide.label,
    imageSrc: resolveProductImageSrc(activeHero.activeSlide.imagePath),
    slideLabel: activeHero.slideLabel,
  };
}
