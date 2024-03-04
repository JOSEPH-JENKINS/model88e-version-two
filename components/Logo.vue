<template>
  <NuxtLink to="/">
    <div :class="getClass()">
      <img src="/logo.svg" alt="logo" />
    </div>
  </NuxtLink>
</template>

<script>
export default {
  mounted() {
    const logo = document.querySelector(".logo");

    logo.addEventListener("click", () => {
      useModal().value = false;
      useAboutSection().value = false;
    });
  },
  methods: {
    getClass() {
      if (useRoute().path === "/shop") {
        return "logo shop";
      } else {
        return "logo";
      }
    },
  },
};
</script>
