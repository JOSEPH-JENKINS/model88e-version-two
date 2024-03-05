<template>
  <div @click="closeModals">
    <Logo />
    <slot />
    <About />
    <Contact />
    <Navbar />
    <Cart />
  </div>
</template>

<script setup>
const closeModals = (e) => {
  if (!e.target.closest("#nav") && e.target.id != "#cart") {
    useCartMode().value = false;
  }

  if (!e.target.closest("#nav") && e.target.id != "#about") {
    useAboutSection().value = false;
  }

  if (!e.target.closest("#nav") && e.target.id != "#contact") {
    useContactSection().value = false;
  }
};
</script>
