import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTranslator } from '@/lib/i18n/translator';
import { useCart } from '@/providers/CartProvider';
import { useRouter } from 'next/navigation';
import { useCheckoutPage } from './useCheckoutPage';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/providers/CartProvider', () => ({
  useCart: vi.fn(),
}));

const mockedUseRouter = vi.mocked(useRouter);
const mockedUseCart = vi.mocked(useCart);
const t = createTranslator('it');

const replace = vi.fn();
const push = vi.fn();
const clearCart = vi.fn();

const baseProduct = {
  id: 'p1',
  title: 'Mouse',
  name: 'Mouse',
  description: 'Wireless mouse',
  imagePath: '/mouse.png',
  imagePaths: ['/mouse.png'],
  category: 'TECHNOLOGY' as const,
  priceInCents: 2500,
  stockQuantity: 5,
  isAvailableForPurchase: true,
  createdAt: '2026-05-01T10:00:00.000Z',
  updatedAt: '2026-05-01T10:00:00.000Z',
};

function mockCart(items = [{ product: baseProduct, quantity: 2 }]) {
  mockedUseCart.mockReturnValue({
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalInCents: items.reduce((sum, item) => sum + item.product.priceInCents * item.quantity, 0),
    addItem: vi.fn(),
    updateQuantity: vi.fn(),
    removeItem: vi.fn(),
    syncWithProducts: vi.fn(),
    clearCart,
  });
}

describe('useCheckoutPage', () => {
  beforeEach(() => {
    replace.mockReset();
    push.mockReset();
    clearCart.mockReset();
    mockedUseRouter.mockReturnValue({ replace, push } as never);
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal(
      'window',
      Object.assign(window, {
        open: vi.fn(),
      })
    );
  });

  it('redirects to the cart when checkout opens with an empty cart', async () => {
    mockCart([]);

    renderHook(() => useCheckoutPage('it'));

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/cart');
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('initializes checkout successfully and becomes ready', async () => {
    mockCart();
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mode: 'demo' }),
    } as Response);

    const { result } = renderHook(() => useCheckoutPage('it'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/checkout',
        expect.objectContaining({ method: 'POST' })
      );
      expect(result.current.status).toBe('ready');
    });
  });

  it('surfaces init failures and clears invalid carts', async () => {
    mockCart();
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'INVALID_CART', message: 'cart invalid' }),
    } as Response);

    const { result } = renderHook(() => useCheckoutPage('it'));

    await waitFor(() => {
      expect(clearCart).toHaveBeenCalled();
      expect(replace).toHaveBeenCalledWith('/cart');
      expect(result.current.status).toBe('error');
      expect(result.current.message).toBe('cart invalid');
    });
  });

  it('captures a card payment and redirects to success', async () => {
    mockCart();
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mode: 'demo' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

    const { result } = renderHook(() => useCheckoutPage('it'));

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
    });

    await act(async () => {
      await result.current.submitCardPayment({ last4: '4242', brand: 'visa' });
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        '/api/checkout/capture',
        expect.objectContaining({ method: 'POST' })
      );
      expect(push).toHaveBeenCalledWith('/checkout/success');
    });
  });

  it('reports a blocked PayPal popup without leaving ready flow', async () => {
    mockCart();
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mode: 'demo' }),
    } as Response);
    vi.mocked(window.open).mockReturnValueOnce(null);

    const { result } = renderHook(() => useCheckoutPage('it'));

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
    });

    act(() => {
      result.current.openPayPalPopup();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.message).toBe(t('checkoutPaypalPopupBlocked'));
  });
});
