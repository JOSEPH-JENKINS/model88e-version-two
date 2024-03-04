<template>
  <div
    :class="useAboutSection().value ? 'about---modal open' : 'about---modal'"
    id="about"
  >
    <h2
      v-for="(paragraph, index) in aboutText"
      :key="index"
      class="about---text"
    >
      {{ paragraph }}
    </h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aboutText: [],
    };
  },
  mounted() {
    this.getAboutText();
  },
  methods: {
    getAboutText() {
      const { $contentfulClient } = useNuxtApp();

      $contentfulClient.getEntry("6JMUVxmhmXV8pJPqMjJWAl").then((entry) => {
        const { content } = entry.fields.content;
        content.forEach((data) => {
          data.content.forEach((paragraph) => {
            const value = paragraph.value;

            this.aboutText.push(value);
          });
        });
      });
    },
  },
};
</script>
