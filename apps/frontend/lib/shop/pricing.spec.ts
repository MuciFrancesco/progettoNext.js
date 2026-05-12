import { describe, expect, it } from 'vitest';
import { calculateSaleFromPercent, calculateSaleFromPrice, getEffectivePriceInCents } from './pricing';

describe('product sale pricing', () => {
  it('uses sale price as the effective price only when the product is in sale', () => {
    expect(getEffectivePriceInCents({ priceInCents: 10000, isInSale: true, salePriceInCents: 8000 })).toBe(8000);
    expect(getEffectivePriceInCents({ priceInCents: 10000, isInSale: false, salePriceInCents: 8000 })).toBe(10000);
  });

  it('calculates sale percent from final sale price', () => {
    expect(calculateSaleFromPrice(10000, 8000)).toEqual({
      isValid: true,
      saleDiscountPercent: 20,
    });
  });

  it('calculates final sale price from discount percent', () => {
    expect(calculateSaleFromPercent(10000, 20)).toEqual({
      isValid: true,
      salePriceInCents: 8000,
    });
  });
});
