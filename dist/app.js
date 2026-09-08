import { processCheckout } from './engine.js';
function getRequiredElement(id) {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLElement)) {
        throw new Error(`Required element #${id} was not found.`);
    }
    return element;
}
const inputs = {
    price: getRequiredElement('itemPrice'),
    quantity: getRequiredElement('itemQuantity'),
    isPremium: getRequiredElement('isPremium'),
    hasCoupon: getRequiredElement('hasCoupon')
};
const outputs = {
    subtotal: getRequiredElement('outSubtotal'),
    discount: getRequiredElement('outDiscount'),
    shipping: getRequiredElement('outShipping'),
    tax: getRequiredElement('outTax'),
    total: getRequiredElement('outTotal'),
    debug: getRequiredElement('debugLog')
};
function updateUI() {
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
    }
    else {
        outputs.shipping.innerHTML = `$${result.shipping.toFixed(2)} <span class="badge fee">Standard</span>`;
    }
    outputs.debug.textContent = `[State Log]\nPrice: $${price} | Qty: ${quantity}\nIsPremium: ${isPremium} | HasCoupon: ${hasCoupon}\nComputed Subtotal: $${result.subtotal}`;
}
Object.values(inputs).forEach((input) => {
    input.addEventListener('input', updateUI);
    input.addEventListener('change', updateUI);
});
updateUI();
