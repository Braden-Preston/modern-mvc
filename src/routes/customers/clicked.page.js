export default (html, props) => html`
  <button
    id="submit-customer"
    class="px-2 py-1 bg-red-400 rounded-lg text-white"
    hx-get="/customers"
    hx-swap="outerHTML"
    hx-select="#submit-customer"
  >
    Countdown! 🚀
  </button>
`
