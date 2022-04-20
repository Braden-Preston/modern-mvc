export const get = async (req, res) => {
  res.view({ cat: 'dog' }, { fragment: false })
}
