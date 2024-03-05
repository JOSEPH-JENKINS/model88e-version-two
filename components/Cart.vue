<template>
  <div
    @click.self="closeContent"
    :class="
      useCartMode().value ? 'nav---container cart open' : 'nav---container cart'
    "
    id="cart"
  >
    <div class="nav cart">
      <div v-if="store.lineItems.edges.length >= 1">
        <div v-for="item in store.lineItems.edges" class="cart---item">
          <h3 class="other---text">
            {{ item.node.title }}
          </h3>
          <div class="display___flex cart---options">
            <div class="quantity">
              <p class="cart--under--text other---text">
                Quantity: {{ item.node.quantity }}
              </p>
            </div>
            <p class="cart--under--text other---text">
              Size: {{ item.node.variant.title }}
            </p>
            <!-- <div class="delete">
              <button class="cart--under--text delete---btn">(Delete)</button>
            </div> -->
          </div>
        </div>
        <div class="checkout---btn---wrapper">
          <a
            :href="store.webUrl"
            class="checkout---text other---text checkout---btn"
            >Proceed to Checkout</a
          >
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
</script>
