import Location from './components/location';
import Weather from './components/weather';

export default class App {
  constructor() {
    this.header = null;
    this.temp = null;
    this.data = {
      lat: null,
      lng: null,
      city: null,
      time: null,
      timezone: null,
    };
    this.temperature = 'C';
    this.tokens = {
      iptoken: '2f27459ab6a3ba',
      geolocaltoken: '7b96c34a5f6f473db10b95895fd31c5a',
      weathertoken: '237d46de088807b8ea4371af72fb7dbd',
      mapToken: 'pk.eyJ1Ijoibm9maXNodG91IiwiYSI6ImNrYThpODZ1YzBkZTUydG1reHVscjh5Z3kifQ.vVtPGkoBiu5KqcwkuA__hg',
      unsplashToken: 'gROqmf8l2f_eBHE5OD-zSUcCgUV_C4NC0XhdTl3pQM4',
    };
    this.location = new Location(this.tokens.mapToken);
    this.weather = new Weather();
  }

  start() {
    if (localStorage.getItem('temperature')) {
      this.temperature = JSON.parse(localStorage.getItem('temperature'));
    } else {
      this.saveTemperature();
    }

    this.setActiveBtn();
    this.addEventListeners();

    fetch(`https://ipinfo.io?token=${this.tokens.iptoken}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return this.location.showMessage(data.error.message);
        }
        return this.getWeather(data);
      })
      .catch((e) => console.log(e));
  }

  addEventListeners() {
    this.header.querySelector('.form form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.getWeather();
    });

    this.header.querySelector('.change-background').addEventListener('click', (e) => {
      e.preventDefault();
      this.changeBackground();
    });

    this.header.querySelector('.change-temperature-fah').addEventListener('click', (e) => {
      e.preventDefault();
      if (this.header.querySelector('.change-temperature-cel').classList.contains('active-btn')) {
        this.header.querySelector('.change-temperature-cel').classList.remove('active-btn');
        e.target.classList.add('active-btn');
        this.weather.changeTempToFah();
        this.temperature = 'F';
        this.saveTemperature();
      }
    });

    this.header.querySelector('.change-temperature-cel').addEventListener('click', (e) => {
      e.preventDefault();
      if (this.header.querySelector('.change-temperature-fah').classList.contains('active-btn')) {
        this.header.querySelector('.change-temperature-fah').classList.remove('active-btn');
        e.target.classList.add('active-btn');
        this.weather.changeTempToCel();
        this.temperature = 'C';
        this.saveTemperature();
      }
    });
  }

  setActiveBtn() {
    if (this.temperature === 'F') {
      document.querySelector('.change-temperature-fah').classList.add('active-btn');
    } else {
      document.querySelector('.change-temperature-cel').classList.add('active-btn');
    }
  }

  saveTemperature() {
    localStorage.setItem('temperature', JSON.stringify(this.temperature));
  }

  getWeather(curLocation) {
    this.location.clearMessage();
    let target;
    if (curLocation) {
      target = curLocation.city;
    } else {
      target = document.querySelector('.form input').value;
    }

    fetch(`https://api.opencagedata.com/geocode/v1/json?key=${this.tokens.geolocaltoken}&q=${target}&pretty=1&no_annotations=1&language=en`)
      .then((res) => res.json())
      .then((location) => {
        if (location.status.code >= 400) {
          return this.location.showMessage(location.status.message);
        }

        if (location.results.length) {
          const results = location.results[0];
          this.temp = results;
          let format;

          if (this.temperature === 'F') {
            format = 'imperial';
          } else {
            format = 'metric';
          }

          return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${results.geometry.lat}&lon=${results.geometry.lng}&exclude&units=${format}&appid=${this.tokens.weathertoken}`)
            .then((res) => res.json());
        }
        return this.location.showMessage('No results :C');
      })
      .then((weather) => {
        if (weather.cod) {
          return this.location.showMessage(weather.message);
        }
        if (weather) {
          this.data.lat = this.temp.geometry.lat;
          this.data.lng = this.temp.geometry.lng;
          this.data.city = this.temp.formatted;
          this.data.timezone = weather.timezone;
          this.data.time = new Date(weather.current.dt * 1000);
          this.location.createMap(this.data.lat, this.data.lng);
          this.location.showLocation(this.data.city, this.data.lat, this.data.lng);
          this.weather.createCards(weather.daily, this.temperature);
          this.location.setClock(this.data.time, this.data.timezone);
        }
        return this.changeBackground();
      })
      .catch((e) => console.log(e));
  }

  changeBackground() {
    fetch(`https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&client_id=${this.tokens.unsplashToken}&query={nature,${this.getSeason()},${this.getDayTime()}}`)
      .then((res) => res.json())
      .then((img) => {
        if (img.errors) {
          return this.location.showMessage(img.errors[0]);
        }
        return this.weather.setBackground(img);
      })
      .catch((e) => {
        console.error(e);
        // set default bg
        this.weather.setBackground();
      });
  }

  getSeason() {
    const time = this.data.time.toLocaleString('en-GB', { hour12: false, timeZone: this.data.timezone, month: 'numeric' });

    if (+time > 2 && +time < 6) {
      return 'spring';
    }
    if (+time > 5 && +time < 9) {
      return 'summer';
    }
    if (+time > 8 && +time < 12) {
      return 'autumn';
    }

    return 'winter';
  }

  getDayTime() {
    const time = this.data.time.toLocaleString('en-GB', { hour12: false, timeZone: this.data.timezone, hour: 'numeric' });

    if (+time > 22 || +time < 6) {
      return 'night';
    }
    if (+time > 6 && +time < 12) {
      return 'morning';
    }
    if (+time > 11 && +time < 18) {
      return 'afternoon';
    }

    return 'evening';
  }

  render() {
    const cont = document.createElement('div');
    const header = document.createElement('header');
    const main = document.createElement('main');

    cont.classList.add('container');
    header.classList.add('header');
    main.classList.add('main');

    header.innerHTML = '<div class="control-panel">'
                       + '<div class="change-background">'
                       + '<button class="change-background-btn btn">Change Background</button></div>'
                       + '<div class="change-temperature">'
                       + '<button class="change-temperature-cel btn">C</button>'
                       + '<button class="change-temperature-fah btn">F</button></div></div>'
                       + '<div class="form"><form><input type="text" class="form-input" placeholder="Enter city name">'
                       + '<button type="submit" class="btn">Search</button></form></div>';

    this.header = header;

    cont.append(header);
    cont.append(main);
    main.append(this.weather.render());
    main.append(this.location.render());

    return cont;
  }
}
