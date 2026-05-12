import type { BackendProduct } from '@/types/api/product';

export function getEffectivePriceInCents(product: Pick<BackendProduct, 'priceInCents' | 'isInSale' | 'salePriceInCents'>): number {
  return product.isInSale && product.salePriceInCents ? product.salePriceInCents : product.priceInCents;
}

export function calculateSaleFromPrice(basePriceInCents: number, salePriceInCents: number) {
  if (basePriceInCents <= 0 || salePriceInCents <= 0 || salePriceInCents >= basePriceInCents) {
    return { isValid: false, saleDiscountPercent: null };
  }

  return {
    isValid: true,
    saleDiscountPercent: Math.round(((basePriceInCents - salePriceInCents) / basePriceInCents) * 100),
  };
}

export function calculateSaleFromPercent(basePriceInCents: number, saleDiscountPercent: number) {
  if (basePriceInCents <= 0 || saleDiscountPercent <= 0 || saleDiscountPercent >= 100) {
    return { isValid: false, salePriceInCents: null };
  }

  return {
    isValid: true,
    salePriceInCents: Math.round(basePriceInCents * (100 - saleDiscountPercent) / 100),
  };
}
