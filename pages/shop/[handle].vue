<template>
  <section>
    <div class="product---page---img">
      <img
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
// FIX 1: Import 'createCartMutation' (new name) from the old file path
import { createCartMutation } from "../../graphql/createCheckoutMutation";
import { getProductQuery } from "../../graphql/getProduct";
// Note: We kept the export name 'addLineItems' in the previous step, so this import remains correct
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
  quantity = parseInt(quantity);
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
        mutation: createCartMutation, // FIX 2: Use the new mutation variable
      });
      // FIX 3: Read from 'cartCreate' instead of 'checkoutCreate'
      cart.storeId(data.cartCreate.cart.id);
    }

    let variantId =
      product.value.productByHandle.variants.edges[selectedVariantIndex].node
        .id;

    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        // FIX 4: Use 'lines' and 'merchandiseId' (Cart API format)
        lines: [{ merchandiseId: variantId, quantity }], 
        cartId: cart.id, // FIX 5: Use 'cartId'
      },
    });

    // FIX 6: Read from 'cartLinesAdd'
    cart.storeCart(data.cartLinesAdd.cart);

    // FIX 7: Use 'checkoutUrl'
    window.location.href = data.cartLinesAdd.cart.checkoutUrl;
  } catch (error) {
    console.error("Error:", error);
  }
};

const addToCart = async (e) => {
  try {
    const apolloClient = useApolloClient();
    if (cart.id === "") {
      const { data } = await apolloClient.client.mutate({
        mutation: createCartMutation, // FIX 8: Use the new mutation variable
      });
      // FIX 9: Read from 'cartCreate'
      cart.storeId(data.cartCreate.cart.id);
    }

    let variantId =
      product.value.productByHandle.variants.edges[selectedVariantIndex].node
        .id;

    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        // FIX 10: Use 'lines' and 'merchandiseId'
        lines: [{ merchandiseId: variantId, quantity }],
        cartId: cart.id, // FIX 11: Use 'cartId'
      },
    });

    // FIX 12: Read from 'cartLinesAdd'
    cart.storeCart(data.cartLinesAdd.cart);
    // alert("Product added to cart");
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
