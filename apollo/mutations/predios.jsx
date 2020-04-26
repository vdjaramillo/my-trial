
export const INSERT_PREDIO = `
  mutation crearPredio($shape: GeoJSON!) {
    createPredio(input: { predio: { shape: $shape } }) {
      clientMutationId
    }
  }
`;