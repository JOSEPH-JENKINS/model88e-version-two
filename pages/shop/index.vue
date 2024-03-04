<template>
  <section class="shop">
    <div class="shop---head">
      <h1 class="shop---head---text">Shop</h1>
    </div>
    <section class="shop---products page---align">
      <!-- {{ data.products }} -->

      <ProductCard
        v-for="product in ui_products.products.edges"
        :key="product.node.id"
        :title="product.node.title"
        :handle="product.node.handle"
        :image="product.node.images.edges[0].node.src"
      />
    </section>
  </section>
</template>

<script setup>
import { getProductsQuery } from "../graphql/getProducts";
import { storeToRefs } from "pinia";
const inventory = useProducts();

let ui_products = null;

const variables = { first: 100 };
let { store } = storeToRefs(inventory);

if (store.value.length >= 1) {
  ui_products = store.value;
} else {
  const { data } = await useAsyncQuery(getProductsQuery, variables);
  inventory.addProductsToStore(data);
  ui_products = data;
}

console.log(store.value);
</script>
