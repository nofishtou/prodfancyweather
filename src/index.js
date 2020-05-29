import App from './js/app.js';

const app = new App();

document.querySelector('#app').append(app.render());
app.start();
