import axios from 'axios';

// `axios` es un módulo singleton: configurar el default acá alcanza para todos
// los archivos que hacen `import axios from 'axios'` en el resto de la app.
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
