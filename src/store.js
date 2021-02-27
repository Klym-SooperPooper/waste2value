import Vue from 'vue';
import Vuex from 'vuex';
import firebase, { db } from './firebase';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

let unsubscribeHandle = null;
const store = new Vuex.Store({
	state: {
		qr: 1,
		db,
		user: null,
	},
	actions: {
		async processFirebaseUser({ commit }, firebaseUser) {
			if (unsubscribeHandle) {
				unsubscribeHandle();
			}
			if (firebaseUser) {
				const userDoc = await db
					.collection('users')
					.doc(firebaseUser.uid)
					.get();

				if (!userDoc.exists) {
					// Случай когда пользователь не зарегистрировался через систему, нужно либо провести через процесс регистрации либо проигнорировать
					return false;
				}

				const userData = userDoc.data();

				if (isNaN(userData.tokens)) userData.tokens = 0;
				if (isNaN(userData.bonus)) userData.bonus = 0;

				commit('userUpdated', { ...userData, uid: firebaseUser.uid });
				unsubscribeHandle = db
					.collection('users')
					.doc(firebaseUser.uid)
					.onSnapshot((doc) => {
						const userData = doc.data();
						commit('userUpdated', { ...userData, uid: firebaseUser.uid });
					});
			} else {
				// Sign out
				commit('userUpdated', null);
			}
		}
	},
	mutations: {
		userUpdated(state, user) {
			state.user = user;
		},
	},
	plugins: [
		createPersistedState({
			reducer: (persistedState) => {
				const stateMap = new Map(Object.entries(persistedState));
				const blackList = ['db'];

				blackList.forEach((key) => {
					stateMap.delete(key);
				});

				return Object.fromEntries(stateMap);
			},
		}),
	],
});

firebase.auth().onAuthStateChanged(firebaseUser => store.dispatch('processFirebaseUser', firebaseUser));

export default store;
