export const getProductQuery = gql`
  query Product($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      productType
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      description
      images(first: 5) {
        edges {
          node {
            src
          }
        }
      }
      variants(first: 5) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;
