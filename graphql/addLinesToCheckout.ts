export const addLineItems = gql`
  mutation cartLinesAdd(
    $cartId: ID!
    $lines: [CartLineInput!]!
  ) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
