<template>
  <section v-if="product && product.productByHandle">
    <div class="product---page---img">
      <img
        v-for="image in product.productByHandle.images?.edges"
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
  <div v-else>Loading...</div>
</template>

<script setup>
import { createCartMutation } from "../../graphql/createCheckoutMutation";
import { getProductQuery } from "../../graphql/getProduct";
import { addLineItems } from "../../graphql/addLinesToCheckout";

const route = useRoute();
const cart = useCart();

const { data: product } = await useAsyncQuery(getProductQuery, {
  handle: route.params.handle,
});

// FIX 3: Make 'variants' a computed property so it updates reactively and safely
// This prevents the script from crashing if product.value is null initially
const variants = computed(() => {
  return product.value?.productByHandle?.variants?.edges || [];
});

// FIX 4: calculate displayVariants based on the computed 'variants'
const displayVariants = computed(() => {
  if (variants.value.length > 1) {
    return variants.value;
  }
  return null;
});

let selectedVariantIndex = 0;
let quantity = 1;

const updateQuantity = (e) => {
  quantity = parseInt(e.target.value);
};

const price = computed(() => {
  // Use optional chaining here too
  const amount = product.value?.productByHandle?.priceRange?.maxVariantPrice?.amount;
  return amount ? `$${amount}` : '';
});

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
        mutation: createCartMutation,
      });
      cart.storeId(data.cartCreate.cart.id);
    }

    // FIX 5: Safely access the variant ID using the computed 'variants'
    const variantId = variants.value[selectedVariantIndex]?.node?.id;

    if (!variantId) {
      console.error("No variant ID found");
      return;
    }

    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        lines: [{ merchandiseId: variantId, quantity }],
        cartId: cart.id,
      },
    });

    cart.storeCart(data.cartLinesAdd.cart);
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
        mutation: createCartMutation,
      });
      cart.storeId(data.cartCreate.cart.id);
    }

    // FIX 6: Safely access the variant ID
    const variantId = variants.value[selectedVariantIndex]?.node?.id;

    if (!variantId) {
      console.error("No variant ID found");
      return;
    }

    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        lines: [{ merchandiseId: variantId, quantity }],
        cartId: cart.id,
      },
    });

    cart.storeCart(data.cartLinesAdd.cart);
  } catch (error) {
    console.error("Error:", error);
  }
};

const descFunction = () => {
  const desc_box = document.querySelector(".desc---modal");
  if (desc_box) desc_box.classList.toggle("open");
};

const selectVariant = (index, e) => {
  handleButtonClickedStyle(e);
  selectedVariantIndex = index;
};
</script>
