import Vue from "vue";
import VueRouter from "vue-router";

import Qr from "@/components/qr";
import Qrarray from "@/components/qrarray";
import Find from "@/components/find";
import Ads from "@/components/ads";
import Deals from "@/components/deals";
import Wallet from "@/components/wallet";
import Rating from "@/components/rating";
import Profile from "@/components/profile";
import Api from "@/components/api";
import Signup from "@/components/signup";
import Recycle from "@/components/recycle";
import Resetpass from "@/components/resetpass";
import store from "./store";

Vue.use(VueRouter);

const routes = [
	{ path: "/", name: "Home", component: Qr, meta: { requiresAuth: true } },
	{ path: "/qr", name: "Qr", component: Qr, meta: { requiresAuth: true } },
	{ path: "/recycle", name: "Recycle", component: Recycle, meta: { requiresAuth: true } },
	{
		path: "/qrarray",
		name: "Qrarray",
		component: Qrarray,
		meta: { requiresAuth: true },
	},
	{
		path: "/profile",
		name: "Profile",
		component: Profile,
		meta: { requiresAuth: true },
	},
	{ path: "/api", name: "Api", component: Api, meta: { requiresAuth: false } },
	{
		path: "/find",
		name: "Find",
		component: Find,
		meta: { requiresAuth: true },
	},
	{ path: "/ads", name: "Ads", component: Ads, meta: { requiresAuth: true } },
	{ path: "/deals", name: "Deals", component: Deals, meta: { requiresAuth: true } },
	{
		path: "/wallet",
		name: "Wallet",
		component: Wallet,
		meta: { requiresAuth: true },
	},
	{
		path: "/rating",
		name: "Rating",
		component: Rating,
		meta: { requiresAuth: true },
	},
	{
		path: "/signup",
		name: "Signup",
		component: Signup,
		meta: { requiresAuth: false },
	},
	{
		path: "/resetpass",
		name: "Resetpass",
		component: Resetpass,
		meta: { requiresAuth: false },
	},
];

const router = new VueRouter({
	// mode: 'history', // vue-cordova сам устанавливает режим роутера
	base: __dirname,
	routes,
});

router.beforeEach((to, from, next) => {
	let requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	let currentUser = store.state.user;

	if (requiresAuth && !currentUser) {
		return next({ name: "Signup" });
	}
	next();
});

export default router;
