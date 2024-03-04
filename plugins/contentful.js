import { createClient } from "contentful";
import contentful from "contentful";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const createClientFunc =
    process.env.NODE_ENV === "development"
      ? createClient
      : contentful.createClient;

  const client = createClientFunc({
    space: "ill4609f6jw1",
    accessToken: "nXeiaTRVAzeqvXDfYrLaC-eGKtmcaDWNFOc2pTf1psI",
  });

  return {
    provide: {
      contentfulClient: client,
    },
  };
});
