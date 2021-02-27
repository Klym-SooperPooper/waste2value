/* eslint-disable */
<template>
	<v-container>
		<v-layout text-center wrap>
			<v-flex xs12>
				<v-img
					:src="require('../assets/logo2.png')"
					class="my-3"
					contain
					height="100"
				></v-img>
			</v-flex>
			<v-flex xs12>
				<template>
					<div class="text-center" v-if="resetpass">
						<v-alert color="green lighten-2" style="padding-top: 7px"
							>Перевірте свій e-mail для встановлення нового паролю</v-alert
						>
					</div>
					<v-tabs color="orange" centered="" v-model="activeTab">
						<v-tab :href="`#register`">Реєстрація</v-tab>
						<v-tab :href="`#login`">Логін</v-tab>
					</v-tabs>
					<br />

					<div class="text-center" v-if="logout">
						<v-alert
							color="orange lighten-2"
							height="40"
							style="padding-top: 7px"
							>Ви вийшли з акаунту</v-alert
						>
					</div>

					<v-alert color="green lighten-2" style="padding-top: 7px"
						>Вітаємо у EcoДія! <br />Заробляйте зелені гроші за свої екологічні
						дії разом з ГО "Містом майбутнього"!</v-alert
					>
					<div class="text-center">
						<div>Партнер EcoДія</div>
						<img src="../assets/misto-m.png" height="150" />
					</div>
					<div>
						<v-form ref="form" v-model="valid" @submit="test" lazy-validation>
							<v-text-field
								outlined
								id="userName"
								v-if="activeTab == 'register'"
								v-model="uName"
								type="text"
								hint="мінімум 8 символів"
								:rules="[rules.required]"
								label="Ваш нікнейм"
							></v-text-field>
							<v-text-field
								outlined
								v-model="email"
								label="Введіть email"
								:rules="[rules.required, ...emailRules]"
							></v-text-field>
							<v-text-field
								v-if="activeTab == 'register'"
								outlined
								v-model="phone"
								hint="У 10-значному форматі 0X0XXXXXXX"
								placeHolder="0X0XXXXXXX"
								id="userPhone"
								label="Введіть телефон"
								type="tel"
								prefix="+38"
								:rules="[phoneRules.required, phoneRules.min, phoneRules.max]"
							></v-text-field>
							<v-text-field
								outlined
								id="passField"
								v-if="activeTab == 'register'"
								v-model="password"
								type="password"
								hint="мінімум 8 символів"
								:rules="[rules.required, rules.min, passwordRules.max]"
								label="Введіть пароль"
							></v-text-field>
							<v-text-field
								outlined
								id="passField"
								v-else
								v-model="password"
								type="password"
								hint="мінімум 8 символів"
								:rules="[rules.required, rules.min, passwordRules.max]"
								label="Введіть пароль"
							></v-text-field>
							<v-text-field
								outlined
								id="repassField"
								v-if="activeTab == 'register'"
								v-model="rePassword"
								type="password"
								hint="мінімум 8 символів"
								:rules="[
									rules.required,
									rules.min,
									passwordRules.max,
									passwordConfirmationRule,
								]"
								label="Підтвердіть пароль"
							></v-text-field>
							<v-alert v-if="authError" dense text type="error">{{
								this.authError
							}}</v-alert>
							<v-btn @click="checkForSignInUser" v-if="activeTab == 'register'"
								>Зареєструватись</v-btn
							>
							<v-btn @click="checkForSignInUser" v-else>Увійти</v-btn>
							<br />
							<br />
							<v-btn
								v-if="activeTab == 'login'"
								color="orange"
								link
								icon
								to="/resetpass"
								small
							>
								Нагадати пароль
							</v-btn>
						</v-form>
					</div>
				</template>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { db } from '../firebase';

const minRule = (min, msg = `Принаймні ${min} символів`) => (v) =>
	v.length >= min || msg;
const maxRule = (max, msg = `Максимум ${max} символів`) => (v) =>
	v.length <= max || msg;

export default {
	name: 'signup',
	data: () => ({
		valid: true,
		logout: false,
		resetpass: false,

		activeTab: 'register',
		authError: null,

		uName: '',
		email: '',
		phone: '',
		password: '',
		rePassword: '',

		// Лучше использовать библиотеку вроде vueliadate/vee-validate из-за того что проверка почт (и многого другого) как правило непростая задача
		emailRules: [
			//v => /.+@.+/.test(v) || 'Невірний e-mail',
			(v) =>
				!v ||
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
				'Невірний e-mail',
		],
		rules: {
			required: (value) => !!value || 'Обов`язкове поле.',
			min: minRule(8),
		},
		passwordRules: {
			max: maxRule(128),
		},
		phoneRules: {
			required: (value) => !!value || 'Обов`язкове поле.',
			min: minRule(10),
			max: maxRule(10),
		},
	}),
	mounted() {
		//check if signed up for avatar
		//add avatar or dismiss
		if (
			typeof this.$route.params.logout != 'undefined' ||
			typeof this.$route.params.resetpass != 'undefined'
		) {
			this.activeTab = 'login';
			this.logout = this.$route.params.logout;
		}
		if (typeof this.$route.params.resetpass != 'undefined') {
			this.resetpass = 1;
		}
	},
	methods: {
		...mapActions(['processFirebaseUser']),
		test(...args) {
			console.log(args);
		},
		passwordConfirmationRule() {
			return this.password === this.rePassword || 'Паролі повинні співпадати';
		},
		checkForSignInUser() {
			this.authError = null;
			this.valid = !this.$refs.form.validate();

			if (this.valid) {
				return false;
			}
			if (this.activeTab == 'register') {
				this.emailSignUp();
			} else {
				this.emailSignIn();
			}
		},
		async emailSignUp() {
			try {
				//check if tokens been awarded
				//let userPhone = this.phone;
				const {
					user,
				} = await this.$firebase
					.auth()
					.createUserWithEmailAndPassword(this.email, this.password);

				let usersRef = db.collection('users');
				let ref = this;
				await db.collection('transactions').where('uid','==',this.phone.toString()).limit(1).get().then(
					querySnapshot => {
						//transactions before sign up
						if(querySnapshot.size){
							querySnapshot.forEach((doc) => {
								let awardTokens = doc.data().tokens;
								db.collection("transactions").doc(doc.id).delete().then(() => {
									usersRef.doc(user.uid).set({
										email: ref.email,
										name: ref.uName,
										phone: ref.phone,
										tokens: awardTokens,
										bonus: 0,
									});
									ref.processFirebaseUser(user).then(
										()=>{
											ref.$router.push('Wallet');
										}
									);
								}).catch((error) => {
									console.error("Error removing document: ", error);
								});
							});
							//no transactions before sign up
						} else {
							usersRef.doc(user.uid).set({
								email: this.email,
								name: this.uName,
								phone: this.phone,
								tokens: 0,
								bonus: 0,
							});

							ref.processFirebaseUser(user).then(
								()=>{
									ref.$router.push({
										name: 'Profile',
										params: { signedup: 1 },
									});
								}
							);
						}
				});
			} catch (error) {
				if (error.code == 'auth/email-already-in-use') {
					this.authError = `Ви вже зареєстровані`;
					this.activeTab = 'login';
					//this.emailSignIn();
					return;
				}
				this.authError = `Несподівана помилка реєстрації`;
				console.warn('Unhandled SignUp error', error);
			}
		},
		async emailSignIn() {
			try {
				const response = await this.$firebase
					.auth()
					.signInWithEmailAndPassword(this.email, this.password);

				await this.processFirebaseUser(response.user).then(
					()=>{
						this.$router.push('Wallet');
					}
				);
				/*await this.$router.push({
					name: 'Profile',
					params: { signedup: 1 },
				});*/
			} catch (error) {
				if (error.code === 'auth/user-not-found') {
					this.authError = `Немає даних користувача, що відповідають цьому електронному листу.`;
					return;
				}
				if (error.code === 'auth/wrong-password') {
					this.authError = `Пароль недійсний або у користувача немає пароля.`;
					return;
				}
				this.authError = `Несподівана помилка входу`;
				console.warn('Unhandled SignIn error', error);
			}
		},
	},
};
</script>
