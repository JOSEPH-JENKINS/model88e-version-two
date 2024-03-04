export const createCheckoutMutation = gql`
  mutation Checkout {
    checkoutCreate(input: {}) {
      checkout {
        id
        webUrl
      }
    }
  }
`;
