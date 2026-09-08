import { CONFIG } from './config.js';

export type CheckoutResult = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  isFreeShipping: boolean;
};

export function calculateSubtotal(price: number, quantity: number): number {
  if (price < 0 || quantity <= 0) {
    return 0;
  }

  return price * quantity;
}

export function calculateShipping(subtotal: number, isPremium: boolean): number {
  const isEligibleForFree = isPremium || subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  return isEligibleForFree ? 0 : CONFIG.STANDARD_SHIPPING_FEE;
}

export function calculateDiscount(subtotal: number, hasCoupon: boolean): number {
  if (!hasCoupon) {
    return 0;
  }

  return subtotal * CONFIG.COUPON_RATE;
}

export function calculateTax(taxableAmount: number): number {
  return taxableAmount * CONFIG.TAX_RATE;
}

export function processCheckout(
  price: number,
  quantity: number,
  isPremium: boolean,
  hasCoupon: boolean
): CheckoutResult {
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
