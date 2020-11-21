import Vue from 'vue';
import Vuex from 'vuex';
import firebase, { db } from './firebase';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		qr: 1,
		db,
		user: null,
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

let listener = null;
firebase.auth().onAuthStateChanged(async (firebaseUser) => {
	if (listener) {
		listener.remove();
	}
	if (firebaseUser) {
		const userDoc = await store.state.db
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

		store.commit('userUpdated', { ...userData, uid: firebaseUser.uid });
		listener = store.state.db
			.collection('users')
			.doc(firebaseUser.uid)
			.onSnapshot((doc) => {
				const userData = doc.data();
				store.commit('userUpdated', { ...userData, uid: firebaseUser.uid });
			});
	} else {
		// Sign out
		store.commit('userUpdated', null);
	}
});

export default store;
