import mapboxgl from 'mapbox-gl';

export default class Location {
  constructor(token) {
    this.token = token;
    this.date = null;
    this.clockCont = null;
    this.city = null;
    this.geolocation = null;
    this.map = null;
    this.time = null;
    this.setInt = null;
    this.message = null;
  }

  showLocation(city, lat, lng) {
    this.city.innerHTML = `<h1>${city}</h1>`;
    this.geolocation.innerHTML = `<span>Latitude: ${lat.toFixed(2)}</span>  <span>Longitude: ${lng.toFixed(2)}</span>`;
  }

  setClock(time, timezone) {
    this.time = time;
    clearInterval(this.setInt);
    this.clock(timezone);
    this.setInt = setInterval(() => {
      this.clock(timezone);
      this.time = new Date(this.time.getTime() + 1000);
    }, 1000);
  }

  createMap(latitude, longitude) {
    mapboxgl.accessToken = this.token;
    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [longitude.toFixed(2), latitude.toFixed(2)],
      zoom: 8,
    });
    new mapboxgl.Marker()
      .setLngLat([longitude.toFixed(2), latitude.toFixed(2)])
      .addTo(map);
  }

  showMessage(text) {
    this.message.innerText = `${text}`;
  }

  clearMessage() {
    this.message.innerHTML = '';
  }

  clock(timezone) {
    const text = this.time.toLocaleString('en-GB', {
      hour12: false, timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    });
    this.clockCont.innerHTML = `${text}`;
  }

  render() {
    const cont = document.createElement('div');
    const message = document.createElement('div');
    const location = document.createElement('div');
    const date = document.createElement('div');
    const clockCont = document.createElement('div');
    const city = document.createElement('div');
    const geolocation = document.createElement('div');
    const map = document.createElement('div');

    cont.classList.add('time-location');
    location.classList.add('location');
    message.classList.add('location-message');
    date.classList.add('location-date');
    clockCont.classList.add('location-clock');
    city.classList.add('location-city');
    geolocation.classList.add('location-geolocation');
    map.id = 'map-container';

    this.message = message;
    this.date = date;
    this.clockCont = clockCont;
    this.city = city;
    this.geolocation = geolocation;
    this.map = map;

    location.append(message);
    location.append(date);
    location.append(city);
    location.append(clockCont);
    location.append(geolocation);
    cont.append(location);
    cont.append(map);

    return cont;
  }
}
