export function formatCurrency(valueInCents: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(valueInCents / 100);
}

export function resolveProductImageSrc(imagePath: string): string {
  if (!imagePath || imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3333';
  return `${backendUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
}
