import { processCheckout } from './engine.js';

function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Required element #${id} was not found.`);
  }

  return element as T;
}

const inputs = {
  price: getRequiredElement<HTMLInputElement>('itemPrice'),
  quantity: getRequiredElement<HTMLInputElement>('itemQuantity'),
  isPremium: getRequiredElement<HTMLInputElement>('isPremium'),
  hasCoupon: getRequiredElement<HTMLInputElement>('hasCoupon')
};

const outputs = {
  subtotal: getRequiredElement<HTMLSpanElement>('outSubtotal'),
  discount: getRequiredElement<HTMLSpanElement>('outDiscount'),
  shipping: getRequiredElement<HTMLSpanElement>('outShipping'),
  tax: getRequiredElement<HTMLSpanElement>('outTax'),
  total: getRequiredElement<HTMLSpanElement>('outTotal'),
  debug: getRequiredElement<HTMLDivElement>('debugLog')
};

function updateUI(): void {
  const price = Number.parseFloat(inputs.price.value) || 0;
  const quantity = Number.parseInt(inputs.quantity.value, 10) || 0;
  const isPremium = inputs.isPremium.checked;
  const hasCoupon = inputs.hasCoupon.checked;

  const result = processCheckout(price, quantity, isPremium, hasCoupon);

  outputs.subtotal.textContent = `$${result.subtotal.toFixed(2)}`;
  outputs.discount.textContent = `-$${result.discount.toFixed(2)}`;
  outputs.tax.textContent = `$${result.tax.toFixed(2)}`;
  outputs.total.textContent = `$${result.grandTotal.toFixed(2)}`;

  if (result.isFreeShipping) {
    outputs.shipping.innerHTML = `$0.00 <span class="badge">FREE</span>`;
  } else {
    outputs.shipping.innerHTML = `$${result.shipping.toFixed(2)} <span class="badge fee">Standard</span>`;
  }

  outputs.debug.textContent = `[State Log]\nPrice: $${price} | Qty: ${quantity}\nIsPremium: ${isPremium} | HasCoupon: ${hasCoupon}\nComputed Subtotal: $${result.subtotal}`;
}

Object.values(inputs).forEach((input) => {
  input.addEventListener('input', updateUI);
  input.addEventListener('change', updateUI);
});

updateUI();
