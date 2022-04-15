// Import app-wide css
import './style.css'

// Import htmx into window
import 'htmx.org'

// Import Alpine + plugins
import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'

// ... other imports

// Setup Alpine plugins
Alpine.plugin(morph)
window.Alpine = Alpine




