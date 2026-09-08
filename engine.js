import { CONFIG } from './config.js';

/** Calculates raw product cost */
export function calculateSubtotal(price, quantity) {
  if (price < 0 || quantity <= 0) return 0;
  return price * quantity;
}

/** Evaluates shipping costs based on member status and spend */
export function calculateShipping(subtotal, isPremium) {
  const isEligibleForFree = isPremium || subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  return isEligibleForFree ? 0 : CONFIG.STANDARD_SHIPPING_FEE;
}

/** Calculates discount reduction */
export function calculateDiscount(subtotal, hasCoupon) {
  if (!hasCoupon) return 0;
  return subtotal * CONFIG.COUPON_RATE;
}

/** Calculates tax amount */
export function calculateTax(taxableAmount) {
  return taxableAmount * CONFIG.TAX_RATE;
}

/** Core Orchestration Function */
export function processCheckout(price, quantity, isPremium, hasCoupon) {
  const subtotal = calculateSubtotal(price, quantity);
  const discount = calculateDiscount(subtotal, hasCoupon);
  const discountedSubtotal = subtotal - discount;
  const shipping = calculateShipping(discountedSubtotal, isPremium);
  const tax = calculateTax(discountedSubtotal);
  const grandTotal = discountedSubtotal + shipping + tax;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    isFreeShipping: shipping === 0
  };
}