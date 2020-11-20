/*global google*/
<template>
	<v-app>
		<template
			><div>
				<v-app-bar>
					<v-btn link icon to="/">
						<v-icon>mdi-qrcode-scan</v-icon>
					</v-btn>
					<img src="./assets/ecodiya.png" height="50" />

					<v-layout
						v-if="$store.state.user"
						justify-end
						style="padding-top: 6px"
					>
						<v-chip
							v-if="$store.state.user.bonus"
							link
							to="/rating"
							text-color="orange"
							color="transparent"
						>
							<v-icon color="orange" small>mdi-star-face</v-icon>
							{{ $store.state.user.bonus }}
						</v-chip>
						<v-chip
							v-if="$store.state.user.tokens"
							link
							to="/wallet"
							text-color="#07C01A"
							color="transparent"
						>
							<v-icon color="#07C01A" small
								>mdi-currency-usd-circle-outline</v-icon
							>
							<span id="topTokens">{{ $store.state.user.tokens }}</span>
						</v-chip>
						<v-chip color="transparent">
							<v-icon color="orange">mdi-bell-plus</v-icon>
							<span>1</span>
						</v-chip>
						<v-btn link icon to="/profile" small>
							<v-avatar right size="32px">
								<v-img
									id="topAvatar"
									v-show="$store.state.user.avatar"
									v-bind:src="$store.state.user.avatar"
								></v-img>
								<v-icon v-show="!$store.state.user.avatar" color="green"
									>mdi-account-circle</v-icon
								>
							</v-avatar>
						</v-btn>
					</v-layout>
				</v-app-bar>
			</div>
		</template>
		<v-content style="margin-bottom: 60px">
			<router-view class="view"></router-view>
		</v-content>

		<v-bottom-navigation
			v-if="$firebase.auth().currentUser"
			app
			grow
			fixed
			color="orange"
		>
			<v-btn value="qr" link icon to="/qr" small>
				<v-icon>mdi-qrcode-scan</v-icon>
			</v-btn>

			<v-btn value="rating" link icon to="/rating" small>
				<v-icon>mdi-podium-gold</v-icon>
			</v-btn>

			<v-btn value="wallet" link icon to="/wallet" small>
				<v-icon>mdi-currency-usd-circle-outline</v-icon>
			</v-btn>

			<v-btn value="find" link icon to="/find" small>
				<v-icon>mdi-map-marker-radius</v-icon>
			</v-btn>

			<v-btn value="ads" link icon to="/ads" small>
				<v-icon>mdi-plus-box-outline</v-icon>
			</v-btn>
		</v-bottom-navigation>
	</v-app>
</template>

<script>
//import Wallet from './components/wallet.vue';
//import Profile from './components/profile.vue';
export default {
	name: "App",
	data: () => ({
		publicPath: process.env.BASE_URL,
		bottomNav: false,
		appUser: false,
	}),
	methods: {
		goProfile() {
			window.location.href = "/#/profile";
		},
	},
	mounted() {
		this.$firebase.auth()
	}
	/*async created() {
      let ref = this;
      if(ref.$firebase.auth().currentUser){
        await ref.$store.state.db.collection('users').doc(ref.$firebase.auth().currentUser.uid).get().then(
          doc=>{
            ref.appUser = doc.data();
          }
        );
      }
    },*/
};
</script>
