<!-- eslint-disable vue/html-self-closing -->
<template>
  <section>
    <div class="product---page---img">
      <!-- <img :src="data.productByHandle.images.edges[0].node.src" /> -->

      <NuxtImg
        v-for="image in product.productByHandle.images.edges"
        :key="image.node.src"
        :src="image.node.src"
        loading="lazy"
      />
    </div>
    <div class="product---actions">
      <div class="main---actions">
        <div class="desc---button">
          <button class="nav---button desc" @click="descFunction">
            <h3 class="nav---text desc">Desc</h3>
          </button>
        </div>
        <div class="price---tag">
          <div class="nav---button price">
            <h3 class="nav---text price">{{ price }}</h3>
          </div>
        </div>
        <div class="desc---button">
          <button class="nav---button cart" @click="addToCart">
            <h3 class="nav---text cart">Add to Cart</h3>
          </button>
        </div>
        <div class="buy---button">
          <button class="nav---button buy" @click="redirectToPayment">
            <h3 class="nav---text buy">Buy</h3>
          </button>
        </div>
      </div>
      <div class="more---options">
        <div class="variant-options" v-if="displayVariants">
          <button
            v-for="(variant, index) in displayVariants"
            :key="index"
            class="variant other---text"
            @click="selectVariant(index, $event)"
          >
            {{ variant.node.title }}
          </button>
        </div>
        <div class="quantity">
          <label for="quantityInt" class="other---text">Quantity</label>
          <input
            id="quantityInt"
            type="number"
            placeholder="Quantity"
            value="1"
            inputmode="numeric"
            pattern="[0-9]*"
            min="1"
            @input="updateQuantity($event)"
          />
        </div>
      </div>
      <div class="desc---modal">
        <h2 class="about---text">{{ product.productByHandle.description }}</h2>
      </div>
    </div>
  </section>
</template>

<script setup>
import { createCheckoutMutation } from "../../graphql/createCheckoutMutation";
import { getProductQuery } from "../../graphql/getProduct";
import { addLineItems } from "../../graphql/addLinesToCheckout";

const route = useRoute();
const cart = useCart();

const { data: product } = await useAsyncQuery(getProductQuery, {
  handle: route.params.handle,
});

const variants = product.value.productByHandle.variants.edges;
let displayVariants = null;

if (variants.length > 1) {
  displayVariants = variants;
}

let selectedVariantIndex = 0;
let quantity = 1;

const updateQuantity = (e) => {
  quantity = e.target.value;
};

const price = computed(
  () => `$${product.value.productByHandle.priceRange.maxVariantPrice.amount}`
);

const removeSelectedClass = () => {
  const variantsButton = document.querySelectorAll(".variant");

  variantsButton.forEach((button) => {
    button.classList.remove("selected");
  });
};

const handleButtonClickedStyle = (e) => {
  removeSelectedClass();

  e.target.classList.add("selected");
};

const redirectToPayment = async (e) => {
  try {
    const apolloClient = useApolloClient();

    if (cart.id === "") {
      const { data } = await apolloClient.client.mutate({
        mutation: createCheckoutMutation,
      });
      cart.storeId(data.checkoutCreate.checkout.id);
    }

    let variantId =
      product.value.productByHandle.variants.edges[selectedVariantIndex].node
        .id;

    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        lineItems: [{ variantId, quantity }],
        checkoutId: cart.id,
      },
    });

    cart.storeCart(data.checkoutLineItemsAdd.checkout);

    window.location.href = data.checkoutLineItemsAdd.checkout.webUrl;
    // console.log(data.checkoutLineItemsAdd.checkout.webUrl);
  } catch (error) {
    console.error("Error:", error);
  }
};

const addToCart = async (e) => {
  try {
    const apolloClient = useApolloClient();
    if (cart.id === "") {
      const { data } = await apolloClient.client.mutate({
        mutation: createCheckoutMutation,
      });
      cart.storeId(data.checkoutCreate.checkout.id);
    }

    let variantId =
      product.value.productByHandle.variants.edges[selectedVariantIndex].node
        .id;

    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        lineItems: [{ variantId, quantity }],
        checkoutId: cart.id,
      },
    });

    cart.storeCart(data.checkoutLineItemsAdd.checkout);
    console.log(data.checkoutLineItemsAdd.checkout);
  } catch (error) {
    console.error("Error:", error);
  }
};

const descFunction = () => {
  const desc_box = document.querySelector(".desc---modal");
  desc_box.classList.toggle("open");
};

const selectVariant = (index, e) => {
  handleButtonClickedStyle(e);
  selectedVariantIndex = index;
};
</script>
