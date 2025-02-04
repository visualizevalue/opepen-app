export const useCoCreators = (data) => (
  [
    data.coCreator1Account,
    data.coCreator2Account,
    data.coCreator3Account,
    data.coCreator4Account,
    data.coCreator5Account,
  ].filter(c => !!c)
)

