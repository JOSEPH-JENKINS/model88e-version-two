<template>
  <div
    @click.self="closeContent"
    :class="
      useCartMode().value ? 'nav---container cart open' : 'nav---container cart'
    "
    id="cart"
  >
    <div class="nav cart">
      <div v-if="store.lines && store.lines.edges.length >= 1">
        
        <div v-for="item in store.lines.edges" :key="item.node.id" class="cart---item">
          
          <h3 class="other---text">
            {{ item.node.merchandise.product.title }}
          </h3>
          
          <div class="display___flex cart---options">
            <div class="quantity">
              <p class="cart--under--text other---text">
                Quantity: {{ item.node.quantity }}
              </p>
            </div>
            
            <p class="cart--under--text other---text">
              Size: {{ item.node.merchandise.title }}
            </p>
            
          </div>
        </div>

        <div class="checkout---btn---wrapper">
          <a
            href="#"
            @click.prevent="goToCheckout"
            class="checkout---text other---text checkout---btn"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>

      <div v-else>
        <h3 class="nav---text">No Items Found in Cart</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
const cart = useCart();

const { store } = storeToRefs(cart);

const closeContent = () => {
  useCartMode().value = false;
};

// --- NEW CHECKOUT LOGIC ---
const goToCheckout = () => {
  // 1. REPLACE THIS WITH YOUR ACTUAL SHOPIFY DOMAIN
  // Example: "cool-clothing.myshopify.com"
  const YOUR_DOMAIN = 'https://45c075-2.myshopify.com'; 

  // 2. Safety check
  if (!store.value.lines || store.value.lines.edges.length === 0) {
    alert("Cart is empty");
    return;
  }

  // 3. Build the permalink ID list (VariantID:Quantity)
  const cartItems = store.value.lines.edges.map((item) => {
    // We need to strip the "gid://shopify/ProductVariant/" part
    // and keep only the number at the end
    const fullId = item.node.merchandise.id;
    const variantId = fullId.split("/").pop();
    const quantity = item.node.quantity;
    
    return `${variantId}:${quantity}`;
  });

  // 4. Create the final URL
  // Format: https://domain.com/cart/12345:1,67890:2
  const checkoutUrl = `https://${YOUR_DOMAIN}/cart/${cartItems.join(",")}`;

  // 5. Redirect
  console.log("Redirecting to:", checkoutUrl);
  window.location.href = checkoutUrl;
};
</script>
