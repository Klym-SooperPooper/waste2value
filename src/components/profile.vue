<template>
	<v-container>
		<v-layout text-center wrap id="myProfileForm">
			<v-flex xs12>
				<template>
					<div>
						<h1 class="headline" style="color: orange">Мій профіль</h1>
						<v-btn
							absolute=""
							top
							right
							small
							id="signOutBtn"
							color="success"
							outlined=""
							class="mr-4"
							@click="signOut"
						>
							<v-icon size="small">mdi-arrow-right</v-icon><small>вийти</small>
						</v-btn>
					</div>
					<br />
					<!-- v-if="signedup"-->
				
					<div class="text-center" v-if="!user.email">
						<v-alert color="orange lighten-2" style="padding-top: 7px"
							><v-icon>mdi-email</v-icon>Вкажіть свій e-mail на випадок зміни
							номеру телефона</v-alert>
					</div>
					<div class="text-center" v-if="avatarUploaded">
						<v-alert
							color="green lighten-2"
							height="40"
							style="padding-top: 7px"
							>Аватар оновлено!</v-alert
						>
					</div>
					<br/>
					<v-form ref="form" id="update-form" v-model="valid" lazy-validation>
						<div id="personal"> 
							<v-row>
								<v-header class="main-label" style="color:green"><strong>Персональні дані</strong></v-header>
							</v-row>
							<br/>
							<v-text-field
								v-model="user.name"
								outlined
								id="userName"
								label="Имя"
								:rules="rules"
								@change="validateForm"
								required
							></v-text-field>
							<v-text-field
								v-model="user.phone"
								outlined
								id="userPhone"
								type="number"
								label="Телефон"
								thumb-label
								:rules="rules"
								@change="validateForm"
								required
							></v-text-field>
							<v-text-field
								v-model="user.email"
								outlined
								id="userEmail"
								label="E-mail"
								:rules="emailRules"
								@change="validateForm"
							></v-text-field>

							<img
								id="profileAvatar"
								v-if="user.avatar"
								v-bind:src="user.avatar"
								width="150"
							/>
							<img id="profileAvatar" v-else src="" width="150" />
							<v-file-input
								outlined
								id="avatarUpload"
								label="Загрузить аватар"
								accept="image/*"
								@change="uploadAvatar($event)"
							></v-file-input>
							</div>
							<div class="text-center" v-if="updated">
								<v-alert
									color="green lighten-2"
									height="40"
									style="padding-top: 7px"
									>Інформацію оновлено!</v-alert
								>
							</div>
							<v-btn
								id="submitForm"
								:disabled="!formIsValid"
								color="success"
								class="mr-4"
								@click="saveInfo"
							>
								Зберегти
							</v-btn>
					</v-form>
				</template>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Profile',
	data: () => ({
		signedup: false,
		avatarUploaded: false,
		updated: false,
		formIsValid: false,
		valid: true,
		profile:{'name':'', 'email':'', 'phone':'', 'avatar':''},
		rules: [(v) => !!v || 'Обов`язкове поле'],
		emailRules: [(v) => /.+@.+/.test(v) || 'Невірний e-mail'],
		bonus:0
  }),
  computed: {
    ...mapState(['user']),
  },
	mounted() {
		if (typeof this.$route.params.signedup != 'undefined') {
			this.signedup = this.$route.params.signedup;
		}
	},
	methods: {
		validateForm() {
			if (this.$refs.form.validate()) {
				this.formIsValid = true;
			} else {
				this.formIsValid = false;
			}
		},
		uploadAvatar(file) {
			let store = this.$store;
			let firebase = this.$firebase;
			let ref = this;
			firebase
				.storage()
				.ref()
				.child('avatars/' + this.user.uid)
				.put(file)
				.then(function (snapshot) {
					console.log('Uploaded a blob or file!' + snapshot);
					//get url
					snapshot.ref.getDownloadURL().then(function (url) {
						store.state.db
							.collection('users')
							.doc(firebase.auth().currentUser.uid)
							.update({ avatar: url });
						var reader = new FileReader();
						reader.onload = function (e) {
							document.getElementById('profileAvatar').src = e.target.result;
							ref.avatarUploaded = true;
							setTimeout(function () {
								ref.avatarUploaded = false;
							}, 3000);
						};
						reader.readAsDataURL(file);
					});
				});
		},
		
		saveInfo() {
			let ref = this;
			if (ref.formIsValid) {
				ref.$store.state.db
					.collection('users')
					.doc(ref.user.uid)
					.update({
						name: document.getElementById('userName').value,
						email: document.getElementById('userEmail').value,
						phone: document.getElementById('userPhone').value
					});
				ref.updated = true;
				let redirect = ref.$router;
				
				setTimeout(function () {
					//redirect to account
					redirect.push({ path: 'wallet', name: 'Wallet' });
				}, 3000);
			} else {
				alert('Форма заповнена невірно!');
			}
		},

		signOut() {
			if (confirm('Ви дійсно хочете вийти з додатку?')) {
				this.$firebase
					.auth()
					.signOut()
					.then(() => {
						this.$router.push({
							name: 'Signup',
							params: { logout: 1 },
						});
					});
			}
		},
	},
};
</script>
