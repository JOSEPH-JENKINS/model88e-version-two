import { defineStore } from "pinia";

export const useProducts = defineStore("products", {
  state: () => {
    return {
      inventory: {},
    };
  },
  actions: {
    addProductsToStore(products) {
      this.store = products;
    },
  },
  getters: {
    store: (state) => state.inventory,
  },
});
