<template>
  <section v-if="hasData">
    <div class="product---page---img">
      <img
        v-for="image in images"
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
            <h3 class="nav---text price">{{ formattedPrice }}</h3>
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
        <h2 class="about---text">{{ description }}</h2>
      </div>
    </div>
  </section>
  
  <div v-else class="loading-state">
    <p>Loading product...</p>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { createCartMutation } from "../../graphql/createCheckoutMutation";
import { getProductQuery } from "../../graphql/getProduct";
import { addLineItems } from "../../graphql/addLinesToCheckout";

const route = useRoute();
const cart = useCart();

// 1. Fetch Data
const { data: product } = await useAsyncQuery(getProductQuery, {
  handle: route.params.handle,
});

// 2. DEBUG: Log the data to console so you can check it
watchEffect(() => {
  console.log("Shopify Data Received:", product.value);
  if (product.value && !product.value.productByHandle) {
    console.error("ERROR: Product not found! Check the handle in your URL.");
  }
});

// 3. Computed Helper: Makes accessing data safe
const productData = computed(() => product.value?.productByHandle || {});

// 4. Safe Properties (These will default to empty/safe values if data is missing)
const hasData = computed(() => !!productData.value.id);

const images = computed(() => productData.value.images?.edges || []);

const variants = computed(() => productData.value.variants?.edges || []);

const description = computed(() => productData.value.description || "");

const formattedPrice = computed(() => {
  const amount = productData.value.priceRange?.maxVariantPrice?.amount;
  return amount ? `$${amount}` : '$0.00';
});

const displayVariants = computed(() => {
  return variants.value.length > 1 ? variants.value : null;
});

// State
let selectedVariantIndex = 0;
let quantity = 1;

// Methods
const updateQuantity = (e) => {
  quantity = parseInt(e.target.value) || 1;
};

const removeSelectedClass = () => {
  const variantsButton = document.querySelectorAll(".variant");
  variantsButton.forEach((button) => button.classList.remove("selected"));
};

const handleButtonClickedStyle = (e) => {
  removeSelectedClass();
  e.target.classList.add("selected");
};

const selectVariant = (index, e) => {
  handleButtonClickedStyle(e);
  selectedVariantIndex = index;
};

const descFunction = () => {
  const desc_box = document.querySelector(".desc---modal");
  if (desc_box) desc_box.classList.toggle("open");
};

// --- CART & CHECKOUT LOGIC (UPDATED FOR CART API) ---

const getVariantId = () => {
  // Safe check to ensure variants exist before accessing
  const variant = variants.value[selectedVariantIndex];
  return variant ? variant.node.id : null;
};

const addToCart = async (e) => {
  try {
    const apolloClient = useApolloClient();
    const variantId = getVariantId();

    if (!variantId) {
      alert("Error: No product variant found.");
      return;
    }

    // A. Create Cart if needed
    if (!cart.id) {
      const { data } = await apolloClient.client.mutate({
        mutation: createCartMutation,
      });
      cart.storeId(data.cartCreate.cart.id);
    }

    // B. Add Line Item
    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        lines: [{ merchandiseId: variantId, quantity }],
        cartId: cart.id,
      },
    });

    cart.storeCart(data.cartLinesAdd.cart);
    // Optional: User feedback here
    console.log("Added to cart");
  } catch (error) {
    console.error("Add to Cart Error:", error);
  }
};

const redirectToPayment = async (e) => {
  try {
    const apolloClient = useApolloClient();
    const variantId = getVariantId();

    if (!variantId) {
      alert("Error: No product variant found.");
      return;
    }

    // A. Create Cart if needed
    if (!cart.id) {
      const { data } = await apolloClient.client.mutate({
        mutation: createCartMutation,
      });
      cart.storeId(data.cartCreate.cart.id);
    }

    // B. Add Line Item
    const { data } = await apolloClient.client.mutate({
      mutation: addLineItems,
      variables: {
        lines: [{ merchandiseId: variantId, quantity }],
        cartId: cart.id,
      },
    });

    cart.storeCart(data.cartLinesAdd.cart);

    // C. Redirect
    if (data.cartLinesAdd.cart.checkoutUrl) {
      window.location.href = data.cartLinesAdd.cart.checkoutUrl;
    } else {
      console.error("No checkout URL returned from Shopify.");
    }
  } catch (error) {
    console.error("Checkout Error:", error);
  }
};
</script>
