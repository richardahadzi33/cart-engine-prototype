import { CONFIG } from './config.js';
export function calculateSubtotal(price, quantity) {
    if (price < 0 || quantity <= 0) {
        return 0;
    }
    return price * quantity;
}
export function calculateShipping(subtotal, isPremium) {
    const isEligibleForFree = isPremium || subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
    return isEligibleForFree ? 0 : CONFIG.STANDARD_SHIPPING_FEE;
}
export function calculateDiscount(subtotal, hasCoupon) {
    if (!hasCoupon) {
        return 0;
    }
    return subtotal * CONFIG.COUPON_RATE;
}
export function calculateTax(taxableAmount) {
    return taxableAmount * CONFIG.TAX_RATE;
}
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
