import { defineStore } from "pinia";

export const useCart = defineStore("cart", {
  state: () => {
    return {
      cart: {
        lineItems: {
          edges: [],
        },
      },
      cartId: "",
      cartUrl: "",
      cartOpen: false,
    };
  },
  actions: {
    toggleCart(state) {
      if (typeof state === "boolean") {
        this.cartOpen = state;
      } else {
        this.cartOpen = !this.cartOpen;
      }
    },
    storeId(id) {
      this.cartId = id;
    },
    storeCart(cart) {
      this.cart = cart;
    },
  },
  getters: {
    id: (state) => state.cartId,
    opened: (state) => state.cartOpen,
    store: (state) => state.cart,
    url: (state) => state.cartUrl,
  },
});
