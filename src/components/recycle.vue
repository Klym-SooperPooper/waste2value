<template>
	<v-container>
		<v-layout text-center wrap id="myProfileForm">
			<v-flex xs12>
				<template>
					<div>
						<h1 class="headline" style="color: orange">Прийняти вторсировину</h1>
					</div>
					<v-alert dense text type="success" v-if="transferMessage">
						{{transferMessage}}
					</v-alert>
					<v-form ref="form" id="update-form" v-model="valid" lazy-validation>
						<v-row>
							<div class="text-center">
								<v-alert color="orange lighten-2" style="padding-top: 7px"
									><v-icon>mdi-phone</v-icon>Вкажіть номер телефона для зарахування зелених</v-alert
								>
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
							</div>
						</v-row>
                        <div class="text-center">
						<v-alert
							color="green lighten-2"
							style="padding-top: 7px"
							>Вкажіть вторсировину за типами
						</v-alert>
						<v-btn href="https://drive.google.com/file/d/1hto04-wgISuxvAoxLNE5aEYFiijJmkSL/view?usp=sharing" target="_blank"><v-icon left dark>mdi-alert-circle</v-icon>Яка вторсировина приймається?</v-btn></div>	
						<br/>
						<!--pet -->
						<v-row>
						<v-header class="main-label" style="color:green"><strong>PET-пляшка</strong></v-header>
						</v-row>
						<v-label>Одиниці виміру (максимум 50 пляшок)</v-label>
						<v-select :items="items" v-model="pcs_selected[0]" @change="selectItems(1)"></v-select>
						<v-row class="pcselector_1">
							<v-col class="pr-4">
								<v-slider
									label="Вкажіть у штуках"
									v-model="slider_pet"
									class="align-center"
									@change="validateForm"
									:max="max"
									:min="min"
									:color="green"
									:track-color="yellow"
									hide-details
								>
									<template v-slot:append>
									<v-text-field
										v-model="slider_pet"
										class="mt-0 pt-0"
										@change="validateForm"
										hide-details
										single-line
										type="number"
										style="width: 60px"
										name="pcs[]"
									></v-text-field>
									</template>
								</v-slider>
							</v-col>
						</v-row>
						<v-row class="pcselector_1" style="display:none">
							<v-text-field
								placeholder="Вкажіть у кілограмах"
								v-model="kg_pet"
								outlined
								@change="validateForm"
								name="kgs[]"
								type="number"
							></v-text-field>
						</v-row>
						<v-alert
							color="blue lighten-3" class="info-raw">
							1 пляшка 1,5 л PET важить 40 грамів
						</v-alert>

						<!--hdpe-->
						<v-row>
						<v-header class="main-label" style="color:green"><strong>HDPE-флакон</strong></v-header>
						</v-row>
						<v-label>Одиниці виміру (максимум 50 пляшок)</v-label>
						<v-select :items="items" v-model="pcs_selected[1]" @change="selectItems(2)"></v-select>
						<v-row class="pcselector_2">
							<v-col class="pr-4">
								<v-slider
									label="Вкажіть у штуках"
									v-model="slider_hdpe"
									class="align-center"
									@change="validateForm"
									:max="max"
									:min="min"
									:color="green"
									:track-color="yellow"
									hide-details
								>
									<template v-slot:append>
									<v-text-field
										v-model="slider_hdpe"
										class="mt-0 pt-0"
										@change="validateForm"
										hide-details
										single-line
										type="number"
										style="width: 60px"
										name="pcs[]"
									></v-text-field>
									</template>
								</v-slider>
							</v-col>
						</v-row>
						<v-row class="pcselector_2" style="display:none">
							<v-text-field
								placeholder="Вкажіть у кілограмах"
								v-model="kg_hdpe"
								outlined
								@change="validateForm"
								type="number"
								name="kgs[]"
							></v-text-field>
						</v-row>
						<v-alert
							color="blue lighten-3" class="info-raw">
							1 пляшка HDPE важить 100 грамів
						</v-alert>

						<!--glass-->
						<v-row>
						<v-header class="main-label" style="color:green"><strong>Скло</strong></v-header>
						</v-row>
						<v-label>Одиниці виміру (максимум 50 пляшок)</v-label>
						<v-select :items="items" v-model="pcs_selected[2]" @change="selectItems(3)"></v-select>
						<v-row class="pcselector_3">
							<v-col class="pr-4">
								<v-slider
									label="Вкажіть у штуках"
									v-model="slider_glass"
									class="align-center"
									@change="validateForm"
									:max="max"
									:min="min"
									:color="green"
									:track-color="yellow"
									hide-details
								>
									<template v-slot:append>
									<v-text-field
										v-model="slider_glass"
										class="mt-0 pt-0"
										@change="validateForm"
										hide-details
										single-line
										type="number"
										style="width: 60px"
										name="pcs[]"
									></v-text-field>
									</template>
								</v-slider>
							</v-col>
						</v-row>
						<v-row class="pcselector_3" style="display:none">
							<v-text-field
								placeholder="Вкажіть у кілограмах"
								v-model="kg_glass"
								outlined
								@change="validateForm"
								type="number"
								name="kgs[]"
							></v-text-field>
						</v-row>
						<v-alert
							color="blue lighten-3" class="info-raw">
							1 пляшка важить приблизно 300 грамів
						</v-alert>

						<v-row>
							<v-header class="main-label" style="color:green"><strong>Картон (папір), кг</strong></v-header>
						</v-row>
						<v-row>
							<v-text-field outlined name="kgs[]" type="number" @change="validateForm"></v-text-field>
						</v-row>

						<v-row>
							<v-header class="main-label" style="color:green"><strong>Метал, кг</strong></v-header>
						</v-row>
						<v-row>
							<v-text-field outlined name="kgs[]" type="number" @change="validateForm"></v-text-field>
						</v-row>

						<v-row>
							<v-header class="main-label" style="color:green"><strong>Алюміній, кг</strong></v-header>
						</v-row>
						<v-row>
							<v-text-field outlined name="kgs[]" type="number" @change="validateForm"></v-text-field>
						</v-row>
										
						<v-btn
							id="submitForm"
							:disabled="!formIsValid"
							color="success"
							class="mr-4"
							@click="saveInfo"
						>
							Зарахувати
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
	name: 'Recycle',
	data: () => ({
		formIsValid: false,
		valid: true,
		min: 0,
        max: 50,
		slider_pet: false,
		kg_pet:false,
		slider_hdpe: false,
		kg_hdpe:false,
		slider_glass: false,
		kg_glass:false,
		items: ['у штуках', 'кг'],
		pcs_selected:['у штуках','у штуках','у штуках'],
		kgs_selected:'кг',
		prices_kgs:[350, 350, 40, 220, 200, 1000],
		prices_pcs:[14, 35, 13, 0, 0, 0],
		pretokens:0,
		rules: [(v) => !!v || 'Обов`язкове поле'],
		bonus:0,
		rawMaterials:[],
		transferMessage:false
  }),
  computed: {
    ...mapState(['user']),
  },
  methods: {
		async sendTokens(transferTokens, transferPhone) {
			let db = this.$store.state.db;
			let senderUserId = this.$firebase.auth().currentUser.uid;
			transferTokens = Number.parseInt(transferTokens);
			if (transferTokens && transferTokens <= this.$store.state.user.tokens) {
				if (transferPhone) {
					this.sendCalc = true;
					try {
						// сейчас может получиться несколько польщователей с одним номером, стоит добавить ограничение и использовать только первого найденного (на всякий случай) либо делать поддержку ситуаци с несколькими пользователями
						await db.collection('users').where('phone', '==', transferPhone).limit(1).get().then(
							querySnapshot => {
								if (!querySnapshot.size) {
									return this.makeTransfer(
										senderUserId,
										transferPhone.toString(),
										transferTokens,
										true
									);
								} else {
									querySnapshot.forEach((doc) => {
										return this.makeTransfer(
											senderUserId,
											doc.id,
											transferTokens,
											false
										);
									});
								}
							}
						);
					} catch (error) {
						console.error('Error: ', error);
					} finally {
						this.sendCalc = false;
					}
				}
			} else {
				if(!transferTokens){
					alert('Оберіть необхідну кількість вторсировини');
				} else {
					alert('Недостатньо зелених на рахунку');
				}
			}
		},

		async makeTransfer(senderUserId, transferUserId, transferTokens, pendingTransaction) {
			//get a user to transfer
			let db = this.$store.state.db;
			let transferBonus = this.bonus;
			let getSenderUserDocRef = db.collection('users').doc(senderUserId);
			let getReceiverUserDocRef = db.collection('users').doc(transferUserId);
			let currentDate = new Date();
			let saveRecycleTransaction = {
				binid: 2,
				fromid:senderUserId,
				bonus: this.bonus,
				bonusRate: this.$bonusRate,
				rawMaterials: this.rawMaterials,
				rate: this.$rate,
				// стоит или использовать аргумент или убрать его из функции
				// tokens: this.transferTokens,
				tokens: transferTokens,
				uid: transferUserId,
				time: Date.now(),
				pending:pendingTransaction,
				date: this.$firebase.firestore.Timestamp.fromDate(currentDate)
			};
			try {
				const docRef = await db
					.collection('transactions')
					.add(saveRecycleTransaction);
				console.log('Transfer written with ID: ', docRef.id);
				//run transfer USER transaction
				// цель транзакций выполнить несколько операций в еденицу времени,
				// иначе пока обновляется аккаунт отправителя, другой запрос мог обновить аккаунт получателя и где-то сумма не сойдется
				const transaction = db
					.runTransaction(async (transaction) => {
						// This code may get re-run multiple times if there are conflicts.
						const getSenderUserDoc = await transaction.get(getSenderUserDocRef);

						if (!getSenderUserDoc.exists) {
							throw new Error(
								'Sender document does not exist!'
							);
						}

						if(!pendingTransaction){
							const getReceiverUserDoc = await transaction.get(
								getReceiverUserDocRef
							);
							const newSenderTokens =
							getSenderUserDoc.data().tokens - transferTokens;
							const senderTr = transaction.update(getSenderUserDocRef, {
								tokens: newSenderTokens,
							});
							const newReceiverTokens =
								getReceiverUserDoc.data().tokens + transferTokens;
							const newReceiverBonus =
								getReceiverUserDoc.data().bonus + transferBonus;
							const receiverTr = transaction.update(getReceiverUserDocRef, {
								tokens: newReceiverTokens,
								bonus: newReceiverBonus,
							});
							return Promise.all([senderTr, receiverTr]);
						} else {
							const newSenderTokens =
								getSenderUserDoc.data().tokens - transferTokens;
							await transaction.update(getSenderUserDocRef, {
								tokens: newSenderTokens,
							});
						}
					})
					.catch(function (error) {
						console.log('Transaction failed: ', error);
					});

				console.log('Transfer & get transaction successfully committed!');
				this.dialog = false;
				
				this.transferMessage = 'На номер '+document.getElementById('userPhone').value+' зараховано зелених: ' + transferTokens;
				this.blinkWalletCounter();
				document.getElementById('userPhone').value = '';
				//run transaction for transfer user
				//router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens}});
				return transaction;
			} catch (error) {
				//eslint-disable-next-line no-console
				console.error('Error adding document: ', error);
			}
		},
		validateForm() {
			if (this.$refs.form.validate()) {
				this.formIsValid = true;
			} else {
				this.formIsValid = false;
			}
		},
		selectItems(pc){
			if(this.pcs_selected[pc-1]=='кг'){
				switch(pc){
					case 1:
						this.slider_pet = false;
					break;

					case 2:
						this.slider_hdpe = false;
					break;

					case 3:
						this.slider_glass = false;
					break;
				}
				document.getElementsByName('pcs[]')[pc-1].value = 0;
				document.getElementsByClassName('pcselector_'+pc)[1].style.display="block";
				document.getElementsByClassName('pcselector_'+pc)[0].style.display="none";
				
			} else {
				document.getElementsByName('kgs[]')[pc-1].value = 0;
				document.getElementsByClassName('pcselector_'+pc)[0].style.display="block";
				document.getElementsByClassName('pcselector_'+pc)[1].style.display="none";
			}
		},
		saveInfo() {
			let ref = this;
			ref.pretokens = 0;
			ref.rawMaterials = [];
			if (this.formIsValid) {
				this.formIsValid = false;
				let rawMaterials = []
				for (var i = 0; i <= 5; i++) {
					if(typeof(document.getElementsByName('pcs[]')[i]) !='undefined' && !isNaN(parseInt(document.getElementsByName('pcs[]')[i].value)) && parseInt(document.getElementsByName('pcs[]')[i].value) > 0){
						rawMaterials.push({
							pcs: 'pcs', 
							value: parseInt(document.getElementsByName('pcs[]')[i].value)
						});
						ref.pretokens = ref.pretokens+this.prices_pcs[i]*document.getElementsByName('pcs[]')[i].value;
						if(i==0){
							ref.slider_pet = false;
						} 
						if(i==1){
							ref.slider_hdpe = false;
						}
						if(i==2){
							ref.slider_glass = false;
						}
					} else {
						if(isNaN(parseInt(document.getElementsByName('kgs[]')[i].value))){
							rawMaterials.push(0);
						} else {
							rawMaterials.push({
								pcs: 'kg', 
								value: parseInt(document.getElementsByName('kgs[]')[i].value)
							});
							ref.pretokens = ref.pretokens+this.prices_kgs[i]*document.getElementsByName('kgs[]')[i].value;
							document.getElementsByName('kgs[]')[i].value = '';
						}
					}	
				}
				this.rawMaterials = rawMaterials;
				ref.sendTokens(ref.pretokens, document.getElementById('userPhone').value);
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
		blinkWalletCounter(){
			let ref = this;
			document.getElementById("walletCounter").classList.add("blink");
			window.scrollTo(0,0);
			setTimeout(
				function(){
					document.getElementById("walletCounter").classList.remove("blink");
					ref.transferMessage = false;
				},5000
			)
		}
	},
};
</script>
