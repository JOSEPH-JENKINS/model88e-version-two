// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Model88E",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Online Store for Eric Bryant (C Bryant Designs)",
        },
        { name: "format-detection", content: "telephone=no" },
        { name: "robots", content: "index, follow" },
        {
          name: "twitter:description",
          content: "Online Store for Eric Bryant (C Bryant Designs)",
        },
        { name: "twitter:title", content: "Moddel88E" },
        { name: "twitter:image", content: "https://model88e.com/logotype.jpg" },
        { name: "twitter:creator", content: "@off___edge" },
        { property: "og:title", content: "Model88E" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "https://model88e.com/logotype.jpg" },
        { property: "og:url", content: "https://model88e.com/" },
        {
          property: "og:description",
          content: "Online Store for Eric Bryant (C Bryant Designs)",
        },
        { property: "og:site_name", content: "Model88E" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "canonical",
          href: "https://www.model88e.com",
        },
      ],
    },
  },

  modules: ["@nuxtjs/apollo", "@nuxt/image", "@pinia/nuxt"],

  image: {
    quality: 90,
    format: ["webp"],
    domains: ["cdn.shopify.com", "images.ctfassets.net"],
  },

  css: ["~/assets/styles/globals.css"],

  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.SHOPIFY_STOREFRONT_HOST,
        httpLinkOptions: {
          headers: {
            "X-Shopify-Storefront-Access-Token":
              process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
        },
      },
    },
  },
});
