<template>
  <div class="gallery">
    <div class="first---image image---box">
      <img src="" alt="Loading..." />
    </div>
    <div class="second---image image---box">
      <img src="" alt="Loading..." />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
      count: 0,
    };
  },
  mounted() {
    this.loadImages();
    this.addImageEventListeners();
  },
  methods: {
    getNextImage() {
      const maxNumberofImages = this.images.length;
      this.count++;

      if (this.count >= maxNumberofImages) {
        this.count = 0;
      }

      return this.images[this.count];
    },
    addImageEventListeners() {
      const imageBox = document.querySelectorAll(".image---box");

      imageBox.forEach((box) => {
        box.addEventListener("mouseover", () => {
          box.children[0].src = `${this.getNextImage()}`;
        });

        box.addEventListener("click", () => {
          box.children[0].src = `${this.getNextImage()}`;
        });
      });
    },
    loadImages() {
      const { $contentfulClient } = useNuxtApp();

      $contentfulClient.getAssets().then((assets) => {
        assets.items.map((image) => {
          const imageURL = `https:${image.fields.file.url}`;
          this.images.push(imageURL);
        });

        const imageBoxes = document.querySelectorAll(".image---box img");

        imageBoxes.forEach((imageBox) => {
          imageBox.src = this.images[0];
        });
      });
    },
  },
};
</script>
