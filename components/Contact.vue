<template>
  <div
    :class="
      useContactSection().value
        ? 'nav---container contact open'
        : 'nav---container contact'
    "
  >
    <div class="nav contact">
      <Button placeholder="Instagram" linked="https://instagram.com/model88e" />
      <Button placeholder="Email" linked="mailto:ebryant@model88e.com" />
    </div>
  </div>
</template>
