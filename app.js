import { processCheckout } from './engine.js';

// DOM Element References
const inputs = {
  price: document.getElementById('itemPrice'),
  quantity: document.getElementById('itemQuantity'),
  isPremium: document.getElementById('isPremium'),
  hasCoupon: document.getElementById('hasCoupon')
};

const outputs = {
  subtotal: document.getElementById('outSubtotal'),
  discount: document.getElementById('outDiscount'),
  shipping: document.getElementById('outShipping'),
  tax: document.getElementById('outTax'),
  total: document.getElementById('outTotal'),
  debug: document.getElementById('debugLog')
};

// Update Controller
function updateUI() {
  // Parse inputs into Numbers & Booleans
  const price = parseFloat(inputs.price.value) || 0;
  const quantity = parseInt(inputs.quantity.value, 10) || 0;
  const isPremium = inputs.isPremium.checked;
  const hasCoupon = inputs.hasCoupon.checked;

  // Pass state variables to pure logic engine
  const result = processCheckout(price, quantity, isPremium, hasCoupon);

  // Render to UI
  outputs.subtotal.textContent = `$${result.subtotal.toFixed(2)}`;
  outputs.discount.textContent = `-$${result.discount.toFixed(2)}`;
  outputs.tax.textContent = `$${result.tax.toFixed(2)}`;
  outputs.total.textContent = `$${result.grandTotal.toFixed(2)}`;

  if (result.isFreeShipping) {
    outputs.shipping.innerHTML = `$0.00 <span class="badge">FREE</span>`;
  } else {
    outputs.shipping.innerHTML = `$${result.shipping.toFixed(2)} <span class="badge fee">Standard</span>`;
  }

  outputs.debug.textContent = `[State Log]
Price: $${price} | Qty: ${quantity}
IsPremium: ${isPremium} | HasCoupon: ${hasCoupon}
Computed Subtotal: $${result.subtotal}`;
}

// Bind Event Listeners
Object.values(inputs).forEach(input => {
  input.addEventListener('input', updateUI);
  input.addEventListener('change', updateUI);
});

// Initial Run
updateUI();