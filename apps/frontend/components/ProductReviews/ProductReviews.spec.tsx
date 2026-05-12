import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductReviews } from './ProductReviews';

const labels = {
  title: 'Recensioni',
  rating: 'Valutazione',
  titleField: 'Titolo',
  bodyField: 'Testo',
  submit: 'Invia',
  verifiedPurchase: 'Acquisto verificato',
  authRequired: 'Registrati o entra prima di inserire una recensione per questo prodotto',
  empty: 'Nessuna recensione inserita ancora per questo articolo, vuoi essere tu il primo a dirci cosa ne pensi?',
};

describe('ProductReviews', () => {
  afterEach(cleanup);

  it('keeps the review list box visible when there are no reviews', () => {
    render(
      <ProductReviews
        reviews={[]}
        rating={5}
        reviewTitle=""
        reviewBody=""
        error={null}
        isPending={false}
        canReview
        canSubmit={false}
        labels={labels}
        onRatingChange={vi.fn()}
        onTitleChange={vi.fn()}
        onBodyChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText(labels.empty)).toBeInTheDocument();
  });

  it('disables submit and shows the localized auth message when reviews require login', async () => {
    const onSubmit = vi.fn();
    render(
      <ProductReviews
        reviews={[]}
        rating={5}
        reviewTitle="Titolo"
        reviewBody="Testo"
        error={null}
        isPending={false}
        canReview={false}
        canSubmit={false}
        labels={labels}
        onRatingChange={vi.fn()}
        onTitleChange={vi.fn()}
        onBodyChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const submit = screen.getByRole('button', { name: labels.submit });

    expect(submit).toBeDisabled();
    expect(screen.getByText(labels.authRequired)).toBeInTheDocument();

    fireEvent.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
