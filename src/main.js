/* eslint-disable no-alert, no-console */
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
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueQrcodeReader from 'vue-qrcode-reader'
import Qr from '@/components/qr'
import Qrarray from '@/components/qrarray'
import Find from '@/components/find'
import Ads from '@/components/ads'
import Wallet from '@/components/wallet'
import Rating from '@/components/rating'
import Profile from '@/components/profile'
import Api from '@/components/api'
import Signup from '@/components/signup'
import Resetpass from '@/components/resetpass'
import createPersistedState from "vuex-persistedstate";
import firebase from '@firebase/app'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';
import { firebaseConfig} from './config'

//import axios from 'axios'
//import VueAxios from 'vue-axios'
// var VueCordova = require('vue-cordova');
require('firebase/firestore')
require('firebase/messaging')
require('firebase/auth')
require ('firebase/storage')

/*
Vue.cordova = Vue.cordova || {
  deviceready: false,
  plugins: []
};*/

firebase.initializeApp(firebaseConfig);
var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyDnzY4zOTwpRwfG0ndEC6xY7qMth71ri8c';
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

//const currentUser = firebase.auth().currentUser;
//Vue.use(VueAxios, axios)
// Vue.use(VueCordova)
Vue.use(VueQrcodeReader)
Vue.use(Vuex)
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: GoogleMapsLoader.KEY.toString()//'...' // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  // version: '...', // Optional
});

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
Vue.use(VueRouter)

const routes = [
    { path: '/', name:'Home', component: Qr, meta: { requiresAuth: true } },
    { path: '/qr', name:'Qr', component: Qr, meta: { requiresAuth: true } },
    { path: '/qrarray', name:'Qrarray', component: Qrarray, meta: { requiresAuth: true } },
    { path: '/profile', name:'Profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/api', name:'Api', component: Api, meta: { requiresAuth: false } },
    { path: '/find', name:'Find', component: Find, meta: { requiresAuth: true } },
    { path: '/ads', name:'Ads', component: Ads, meta: { requiresAuth: true } },
    { path: '/wallet', name:'Wallet', component: Wallet, meta: { requiresAuth: true } },
    { path: '/rating', name:'Rating', component: Rating, meta: { requiresAuth: true } },
    { path: '/signup', name:'Signup', component: Signup, meta: {requiresAuth: false}},
    { path: '/resetpass', name:'Resetpass', component: Resetpass, meta: {requiresAuth: false}}
]
const router = new VueRouter({
  /*mode: 'history',*/
  base: __dirname,
   routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    let currentUser = firebase.auth().currentUser;
    // if(currentUser){
    //   store.state.db.collection('users').doc(currentUser.uid).get().then(
    //     doc=>{
    //       store.state.user = doc.data();
    //       store.state.user.tokens = doc.data().tokens;
    //       if(isNaN(store.state.user.tokens)){store.state.user.tokens=0;}
    //       if(isNaN(store.state.user.bonus)){store.state.user.bonus=0;}
    //       console.log('state changed');
    //       console.log(store.state.user);
    //     }
    //   );
    // }
    if (requiresAuth && !firebase.auth().currentUser) {
      next('signup');
    } else {
      if (!requiresAuth && currentUser) {
        next();
      }
      else { next();}
    }
});

Vue.config.productionTip = false;
//pass encryptor to component
Object.defineProperty(Vue.prototype, '$encryptor', { value: encryptor });
Object.defineProperty(Vue.prototype, '$vuecordova', { value: window.cordova });
Object.defineProperty(Vue.prototype, '$qrcode', { value: qrcode });
Object.defineProperty(Vue.prototype, '$firebase', { value: firebase });
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

const store = new Vuex.Store({
  state: {
    qr: 1,
    db:firebase.firestore(),
    user:false
  },
  mutations: {
    loggedIn (state, user) {
      state.user = user
    },
  },
  plugins: [createPersistedState({
    reducer: (persistedState) => {
      const stateMap = new Map(Object.entries(persistedState))
      const blackList = ['db']

      blackList.forEach((key) => {
        stateMap.delete(key)
      })

      return Object.fromEntries(stateMap)
    }
  })]
});

firebase.auth().onAuthStateChanged(async (firebaseUser) => {
  if (firebaseUser) {
    const userDoc = await store.state.db.collection('users').doc(firebaseUser.uid).get()
    if (!userDoc.exists) {
      console.warn('No user found')
      const sampleData = {
        tokens: 0,
        bonus: 0,
      }
      store.commit('loggedIn', sampleData)
      return false
    }

    const userData = userDoc.data()

    if (isNaN(userData.tokens)) userData.tokens = 0;
    if (isNaN(userData.bonus)) userData.bonus = 0;

    store.commit('loggedIn', userData)

    console.log('signed in user');
    console.log(store.state.user);
  }
});

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
