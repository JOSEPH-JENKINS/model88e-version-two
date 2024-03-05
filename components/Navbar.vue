<template>
  <div class="nav---container" id="nav">
    <div class="nav">
      <Button placeholder="Shop" linked="/shop" />
      <Button
        :placeholder="useContactSection().value ? 'Close' : 'Contact'"
        :clickFunction="contactFunction"
        :contact="true"
      />
      <Button
        :placeholder="
          useAboutSection().value && useModal().value ? 'Close' : 'About'
        "
        :clickFunction="aboutFunction"
        :about="true"
        id="about---button"
      />
      <Button placeholder="Cart" id="cart---button" :clickFunction="cartFunc" />
    </div>
  </div>
</template>

<script setup>
import { useCartMode, useContactSection } from "~/composables/states";

const aboutFunction = (e) => {
  e.preventDefault();
  useAboutSection().value = !useAboutSection().value;
  useModal().value = !useModal().value;
  useCartMode().value = false;
};

const contactFunction = (e) => {
  e.preventDefault();
  useContactSection().value = !useContactSection().value;
  useAboutSection().value = false;
};

const cartFunc = (e) => {
  e.preventDefault();
  useCartMode().value = !useCartMode().value;
};
</script>
