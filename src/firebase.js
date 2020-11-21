import Vue from 'vue';
import firebase from '@firebase/app';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/auth';
import 'firebase/storage';

import { firebaseConfig } from './config';

firebase.initializeApp(firebaseConfig);
Object.defineProperty(Vue.prototype, '$firebase', { value: firebase });

export default firebase;
export const db = firebase.firestore();
