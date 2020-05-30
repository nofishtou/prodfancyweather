export default class Weather {
  constructor() {
    this.cont = null;
    this.today = null;
    this.prognose = null;
    this.temperature = null;
    this.options = {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    };
  }

  createCards(data, temperature) {
    this.temperature = temperature;
    this.today.innerHTML = '';
    this.prognose.innerHTML = '';
    this.changeTodayCard(data[0]);
    this.prognose.append(this.createCard(data[1]));
    this.prognose.append(this.createCard(data[4], 'day-middle'));
    this.prognose.append(this.createCard(data[7]));
    this.setBackground();
  }

  changeTodayCard(data) {
    const card = document.createElement('div');
    const text = document.createElement('div');
    const shadow = document.createElement('div');

    shadow.classList.add('shadow-bg');
    card.classList.add('day');
    card.classList.add('today-day');
    text.classList.add('text');

    let windSpeed;
    if (this.temperature === 'F') {
      windSpeed = 'mph';
    } else {
      windSpeed = 'm/s';
    }

    card.innerHTML = `<span class="today-day-text temperature">${Math.round(data.temp.day)} &deg;${this.temperature}</span>`
    + `<span class="today-day-date">${new Date(data.dt * 1000).toLocaleDateString('en-GR', this.options)}</span>`;
    text.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="iconka">`
                    + `</img><span class="text-span"> clouds: ${data.clouds} %</span>`
                    + `<span class="text-span">pressure: ${data.pressure} hPa</span>`
                    + `<span class="text-span">humidity: ${data.humidity} %</span>`
                    + `<span class="text-span">wind speed: ${data.wind_speed} ${windSpeed}</span>`;

    this.today.append(shadow);
    this.today.append(card);
    this.today.append(text);
  }

  createCard(data, middle) {
    const div = document.createElement('div');
    div.classList.add('day');
    if (middle) {
      div.classList.add(`${middle}`);
    }
    div.innerHTML = `<span class="day-text temperature">${Math.round(data.temp.day)} &deg;${this.temperature}</span>`
    + `<span class="day-date">${new Date(data.dt * 1000).toLocaleDateString('en-US', this.options)}</span>`
    + `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="iconka"></img>`;
    return div;
  }

  setBackground(data) {
    if (data) {
      this.background.innerHTML = `<img class="today-background-img" src="${data.urls.regular}" alt="${data.alt_description}" loading="lazy"/>`;
    } else {
      this.background.innerHTML = '<img class="today-background-img" src="./assets/img/background.jpg" alt="cafe" loading="lazy"/>';
    }

    this.today.append(this.background);
  }

  changeTempToCel() {
    const spans = [...this.cont.querySelectorAll('.temperature')];

    spans.forEach((el) => {
      const t = el;
      t.innerHTML = `${Math.round((parseInt(el.textContent, 10) - 32) / 1.8)} &deg;C`;
    });
  }

  changeTempToFah() {
    const spans = [...this.cont.querySelectorAll('.temperature')];

    spans.forEach((el) => {
      const t = el;
      t.innerHTML = `${Math.round((parseInt(el.textContent, 10) * 1.8) + 32)} &deg;F`;
    });
  }

  render() {
    const cont = document.createElement('div');
    const today = document.createElement('div');
    const prognose = document.createElement('div');
    const background = document.createElement('div');


    cont.classList.add('weather');
    today.classList.add('today');
    prognose.classList.add('prognose');
    background.classList.add('today-background');

    this.cont = cont;
    this.today = today;
    this.prognose = prognose;
    this.background = background;

    cont.append(today);
    cont.append(prognose);

    return cont;
  }
}
