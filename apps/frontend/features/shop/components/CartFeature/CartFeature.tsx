'use client';

import { Cart } from '@/components/Cart/Cart';
import { CartItem } from '@/components/CartItem/CartItem';
import { CartSummary } from '@/components/CartSummary/CartSummary';
import type { Locale } from '@/lib/i18n/translation';
import { formatCurrency } from '@/lib/shop/format';
import { useCartPage } from '@/features/shop/hooks/useCartPage';
import { useCartDraftQuantities } from '@/features/shop/hooks/useCartDraftQuantities';
import { mapCartItemsToViewModels } from '@/features/shop/helpers/mapCartItems';
import { useWishlist } from '@/store/WishlistContext';
import { SavedForLaterFeature } from '@/features/favorites/SavedForLaterFeature';

export function CartFeature({ locale }: Readonly<{ locale: Locale }>) {
  const cart = useCartPage(locale);
  const { addItem: addToWishlist } = useWishlist();
  const { draftQuantities, handleDraftChange, handleCommit, handleDraftBlur } =
    useCartDraftQuantities(cart.updateQuantityWithStockCheck);

  const items = mapCartItemsToViewModels(cart.items, {
    locale: cart.locale,
    unitSuffix: cart.labels.unitSuffix,
  });

  return (
    <>
      <Cart
        hasItems={cart.hasItems}
        labels={cart.labels}
        stockAlerts={cart.stockAlerts}
        summary={
          <CartSummary
            totalLabel={formatCurrency(cart.totalInCents, cart.locale)}
            hasItems={cart.hasItems}
            labels={cart.labels}
          />
        }
      >
        {items.map((item) => {
          const cartItem = cart.items.find((i) => i.product.id === item.productId);
          return (
            <CartItem
              key={item.productId}
              item={item}
              labels={cart.labels}
              warningMessage={cart.quantityWarnings[item.productId]}
              draftQuantity={draftQuantities[item.productId] ?? String(item.quantity)}
              onDraftChange={(value) => handleDraftChange(item.productId, value)}
              onDraftBlur={() => handleDraftBlur(item.productId, item.quantity)}
              onDecrease={() => handleCommit(item.productId, item.quantity - 1)}
              onIncrease={() => handleCommit(item.productId, item.quantity + 1)}
              onRemove={() => cart.removeItem(item.productId)}
              onSaveForLater={
                cartItem
                  ? () => {
                      void addToWishlist(cartItem.product, item.quantity);
                      cart.removeItem(item.productId);
                    }
                  : undefined
              }
            />
          );
        })}
      </Cart>
      <SavedForLaterFeature locale={cart.locale} />
    </>
  );
}
