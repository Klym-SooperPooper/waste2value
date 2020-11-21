/******TO DO********/
//try mutation for user state
//check avatar adding
//dialog window for sum up tokens
//classified adding
//pass without name?
//+geocoder input+post ad
//ads list

//hash algo for QR generation
//static gMap for bins infoWindow
//build Android apk
//test Android
//build IOS
//first commit line
//
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueQrcodeReader from 'vue-qrcode-reader';
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';
import { firestorePlugin } from 'vuefire';

import router from './router';
import store from './store';

//import axios from 'axios'
//import VueAxios from 'vue-axios'
// var VueCordova = require('vue-cordova');

/*
Vue.cordova = Vue.cordova || {
  deviceready: false,
  plugins: []
};*/

var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyDnzY4zOTwpRwfG0ndEC6xY7qMth71ri8c';
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

//const currentUser = firebase.auth().currentUser;
//Vue.use(VueAxios, axios)
// Vue.use(VueCordova)
Vue.use(VueQrcodeReader);
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: GoogleMapsLoader.KEY.toString()//'...' // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  // version: '...', // Optional
});
Vue.use(firestorePlugin);

const qrcode = require('qrcode-generator')
const axios = require('axios');
/*axios.get('/api?binid=1&count=1&key=ababagalamaga', { validateStatus: false })
  .then(
    function(response) {
      alert(JSON.stringify(response));
      console.log(response);
    }
).catch(function (error) {
  // handle error
  alert(error);
});*/

var key = 'Save planet as a result of Common Actions!';
// Create an encryptor:
var encryptor = require('simple-encryptor')(key);

Vue.config.productionTip = false;
//pass encryptor to component
Object.defineProperty(Vue.prototype, '$encryptor', { value: encryptor });
Object.defineProperty(Vue.prototype, '$vuecordova', { value: window.cordova });
Object.defineProperty(Vue.prototype, '$qrcode', { value: qrcode });
Object.defineProperty(Vue.prototype, '$axios', { value: axios });
//RECYCLING rate
Object.defineProperty(Vue.prototype, '$rate', { value: 10 });
//RECYCLING bonus
Object.defineProperty(Vue.prototype, '$bonusRate', { value: 100 });
//TRANSACTION KEY
Object.defineProperty(Vue.prototype, '$transactionKey', { value: 'ababagalamaga' });
//GoogleMapsLoader
Object.defineProperty(Vue.prototype, '$GoogleMapsLoader', { value: GoogleMapsLoader });
Object.defineProperty(Vue.prototype, '$VuetifyGoogleAutocomplete', { value: VuetifyGoogleAutocomplete });


new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
