export default (html, { customer }) => html`
  <div id="content">
    <h1 class="text-lg font-bold underline text-purple-500">Customers</h1>

    <div>
      <a href="/" hx-boost="true" hx-target="#content">Back</a>
    </div>

    <h1 class="text-blue-500">Customers</h1>

    <ul>
      ${customers.map(customer => html` <li><a href="/">${customer}</a></li> `)}
    </ul>

    <button
      id="submit-customer"
      class="px-2 py-1 bg-green-500 rounded-lg text-white"
      hx-get="/customers/clicked"
      hx-trigger="click"
      hx-target="this"
      hx-swap="outerHTML"
    >
      Click Me
    </button>
  </div>
`
