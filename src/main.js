/* eslint-disable no-alert, no-console */
/******TO DO********/
//+geocoder input+post ad
//ads list
//hash algo for QR generation
//static gMap for bins
//build Android apk
//test Android
//build IOS
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueQrcodeReader from 'vue-qrcode-reader'
import Qr from '@/components/qr'
import Find from '@/components/find'
import Ads from '@/components/ads'
import Wallet from '@/components/wallet'
import Rating from '@/components/rating'
import Profile from '@/components/profile'
import Signup from '@/components/signup'
import createPersistedState from "vuex-persistedstate";
import firebase from '@firebase/app'
require('firebase/firestore')
require('firebase/messaging')
require('firebase/auth')
require ('firebase/storage')
import { firebaseConfig} from './config'
firebase.initializeApp(firebaseConfig);
var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyDnzY4zOTwpRwfG0ndEC6xY7qMth71ri8c';

//const currentUser = firebase.auth().currentUser;
Vue.use(VueQrcodeReader)
Vue.use(Vuex)

const qrcode = require('qrcode-generator')
var key = 'Save planet as a result of Common Actions!';
// Create an encryptor:
var encryptor = require('simple-encryptor')(key);
Vue.use(VueRouter)

const routes = [
    { path: '/', name:'Home', component: Qr, meta: { requiresAuth: true } },
    { path: '/qr', name:'Qr', component: Qr, meta: { requiresAuth: true } },
    { path: '/profile', name:'Profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/find', name:'Find', component: Find, meta: { requiresAuth: true } },
    { path: '/ads', name:'Ads', component: Ads, meta: { requiresAuth: true } },
    { path: '/wallet', name:'Wallet', component: Wallet, meta: { requiresAuth: true } },
    { path: '/rating', name:'Rating', component: Rating, meta: { requiresAuth: true } },
    { path: '/signup', name:'Signup', component: Signup, meta: {requiresAuth: false}}
]
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
   routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    let currentUser = firebase.auth().currentUser;
    if(currentUser){
      store.state.db.collection('users').doc(currentUser.uid).get().then(
      doc=>{
        store.state.user = doc.data();
        console.log('state changed');
        console.log(store.state.user);
      }
    );}   
    if (requiresAuth && (!currentUser || currentUser === null)) { next('/signup');}
    if (!requiresAuth && currentUser) {next('/');}
    else { next();}
});

Vue.config.productionTip = false;
//pass encryptor to component
Object.defineProperty(Vue.prototype, '$encryptor', { value: encryptor });
Object.defineProperty(Vue.prototype, '$qrcode', { value: qrcode });
Object.defineProperty(Vue.prototype, '$firebase', { value: firebase });
//RECYCLING rate
Object.defineProperty(Vue.prototype, '$rate', { value: 100 });
//RECYCLING bonus
Object.defineProperty(Vue.prototype, '$bonusRate', { value: 100 });
//GoogleMapsLoader
Object.defineProperty(Vue.prototype, '$GoogleMapsLoader', { value: GoogleMapsLoader });

const store = new Vuex.Store({
  state: {
    qr: 1,
    db:firebase.firestore(),
    user:false
  },
  plugins: [createPersistedState()]
});

const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
  console.log('state changed');
  new Vue({
    vuetify,
    router,
    store,
    render: h => h(App),
    created(){
      if(firebaseUser){
        store.state.db.collection('users').doc(firebaseUser.uid).get().then(
          doc=>{
            store.state.user = doc.data();
            console.log('signed in user');
            console.log(store.state.user);
          }
        )
      }
    }
  }).$mount('#app');
  unsubscribe();
});



