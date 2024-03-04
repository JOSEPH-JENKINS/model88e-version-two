export const addLineItems = gql`
  mutation checkoutLineItemsAdd(
    $checkoutId: ID!
    $lineItems: [CheckoutLineItemInput!]!
  ) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;
