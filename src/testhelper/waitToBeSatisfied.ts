export const waitToBeSatisfied = async (
  fn: () => boolean,
  timeout = 1000,
  interval = 10,
): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    let spent = 0
    setInterval(() => {
      if (fn()) {
        resolve(true)
        return
      }
      spent += interval
      if (spent > timeout) {
        reject()
        return
      }
    }, interval)
  })
}
