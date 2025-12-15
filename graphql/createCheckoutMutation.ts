export const createCartMutation = gql`
  mutation CreateCart {
    cartCreate(input: {}) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`;
