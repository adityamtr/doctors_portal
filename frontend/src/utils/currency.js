export function formatPrice(price) {
  if (price === null || price === undefined) return ''

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(price / 100)
}
