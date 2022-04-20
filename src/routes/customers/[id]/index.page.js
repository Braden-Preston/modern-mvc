export default ({ html, props }) => {
  let { cat = 'cats' } = props

  return html`<h3>Customer: #ID ${cat}</h3>`
}
