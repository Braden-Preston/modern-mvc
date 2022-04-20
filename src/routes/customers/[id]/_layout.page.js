export default ({html, props, children}) => {
  // console.log(ctx)
  // console.log('layout', props, children)
  // return 'cats'
  return html`<div href=${props.url} style="border: 4px solid blue; padding: 16px;">${children}</div>`
}