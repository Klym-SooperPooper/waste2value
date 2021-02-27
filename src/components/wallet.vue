<template>
	<v-container>
		<v-layout text-center wrap>
			<v-flex>
				<v-snackbar
					class="text-center"
					top
					light
					color="white"
					v-model="snackbar"
				>
					<v-alert color="green lighten-2" height="40" style="padding-top: 7px"
						><v-icon>mdi-coins</v-icon>Зараховано зелених:
						{{ $route.params.transferred }}</v-alert
					>
				</v-snackbar>

				<h1 class="headline" style="color: orange">Мій гаманець</h1>

				<div>
					<!--
					<div class="text-center" v-if="$store.state.user.pretokens">
						<v-alert
							color="green lighten-2"
							height="80"
							style="padding-top: 7px"
							>Вітаємо у EcoДія!<br/>
							Ваші зелені нарахуються після перевірки на сортувальній станції
						</v-alert>
						<v-chip
							v-if="$store.state.user.pretokens"
							text-color="grey"
							color="transparent"
							style="margin-top: 10px"
						>
							<v-icon color="#07C01A" large
								>mdi-currency-usd-circle-outline</v-icon
							>
							<span class="display-1">{{ user.pretokens }}</span>
						</v-chip>
					</div>
					-->
					<div>
						<v-chip
							v-if="$store.state.user.tokens"
							text-color="#07C01A"
							color="transparent"
							style="margin-top: 10px"
						>
							<v-icon color="#07C01A" large
								>mdi-currency-usd-circle-outline</v-icon
							>
							<span class="display-1">{{ user.tokens }}</span>
						</v-chip>
						<v-chip
							v-else
							text-color="#07C01A"
							color="transparent"
							style="margin-top: 10px"
						>
							<v-icon color="#07C01A" large
								>mdi-currency-usd-circle-outline</v-icon
							>
							<span class="display-1">0</span>
						</v-chip>
					</div>
				</div>
				<br />
				<div id="placeHolder"></div>
				<!-- @click="dialog = true" -->
				<v-btn dark color="grey">Надіслати зелені
					<v-icon>mdi-currency-usd-circle-outline</v-icon></v-btn
				>
				<v-dialog v-model="dialog" color="#fff">
					<v-card>
						<v-card-title v-if="!generatedTokens"
							>Введіть суму токенів</v-card-title
						>
						<v-card-text v-if="!generatedTokens">
							<!--
              <v-text-field
                id="transferTokens"
                label="Введіть суму"
                solo
                outlined
                height="20"
                v-model="transferTokens"
              ></v-text-field>
              -->
							<v-text-field
								id="recycleItems"
								label="Введіть кількість пляшок"
								solo
								outlined
								height="20"
								required
								@change="calcTokens(recycleItems)"
								v-model="recycleItems"
							></v-text-field>

							<v-text-field
								id="transferTokens"
								label="Кількість зелених"
								solo
								outlined
								height="20"
								required
								v-model="transferTokens"
							></v-text-field>

							<v-text-field
								id="transferPhone"
								label="Номер телефона"
								solo
								outlined
								required
								height="20"
								v-model="transferPhone"
							></v-text-field>
							<v-btn
								text
								color="green"
								:disabled="(!transferTokens && !transferPhone) || sendCalc"
								outlined
								@click="sendTokens(transferTokens, transferPhone)"
								>Надіслати бонуси</v-btn
							><br />
						</v-card-text>

						<div id="qrHolderOuter" v-show="generatedTokens">
							<div class="text-center">
								<v-alert
									color="green lighten-2"
									height="40"
									style="padding-top: 7px"
									>Покажіть QR-код отримувачу</v-alert
								>
							</div>
							<div ref="qrHolder"></div>
						</div>
					</v-card>
				</v-dialog>
				<br /><br />
				<img src="../assets/cash-icon.png" height="80" />
				<div style="text-align:center; color:green">Курс: 1 гривня = 100 зелених</div>
						<div class="text-center">
						<v-alert dense text type="success">
							За нараховані бали незабаром ви зможете отримати певні винагороди: екотовари, поповнення мобільного рахунку або <strong>готівку на власну банківську картку</strong>.
						</v-alert>
				</div>
				<v-card>
					<v-tabs background-color="white" centered color="#07C01A">
						<v-tab
							><v-icon>mdi-currency-usd-circle-outline</v-icon>Пропозиції</v-tab
						>
						<!--<v-tab><v-icon>mdi-star-face</v-icon>Подарунки</v-tab>-->
						<v-tab-item>
							<v-banner one-line>
								<v-avatar slot="icon" color="ref" size="40">
									<v-icon icon="mdi-ticket" color="green" size="40">
										mdi-cellphone
									</v-icon>
								</v-avatar>
								<div class="headline text-left">Поповнення мобільного</div>
								<p>Екотариф</p>
								<template v-slot:actions>
									<v-btn dark color="green accent-4">поповнити</v-btn>
								</template>
							</v-banner>

							<v-banner one-line>
								<v-avatar slot="icon" size="40">
									<v-icon icon="mdi-emoticon-cool" color="orange">
										mdi-emoticon-cool
									</v-icon>
								</v-avatar>
								<div class="headline text-left">Екотовари</div>
								<p></p>
								<template v-slot:actions>
									<v-chip text-color="orange" color="transparent">
										<v-icon color="#07C01A"
											>mdi-currency-usd-circle-outline</v-icon
										>
										
									</v-chip>
									<v-btn text color="green accent-4">незабаром</v-btn>
								</template>
							</v-banner>
						</v-tab-item>
						<v-tab-item>
							<div class="text-center">
								<v-alert
									border="bottom"
									colored-border
									type="warning"
									elevation="2"
								>
									Кількість бонусних подарунків обмежена</v-alert
								>
							</div>
							<v-banner one-line>
								<v-avatar slot="icon" color="green" size="40">
									<v-icon icon="mdi-ticket" color="white"> mdi-ticket </v-icon>
								</v-avatar>
								<div class="headline text-left">Квиток на концерт</div>
								<p>Альона, Альона</p>
								<template v-slot:actions>
									<v-chip text-color="orange" color="transparent">
										<v-icon color="orange">mdi-star-face</v-icon>
										200
									</v-chip>
									<v-btn text color="green accent-4">незабаром</v-btn>
								</template>
							</v-banner>
						</v-tab-item>
					</v-tabs>
				</v-card>

				<!--
         <v-card
            color="#698ea1"
            dark
          >
            <v-card-title class="headline">Мої транзакції</v-card-title>

            <v-card-subtitle>Усі відсортовані пляшки</v-card-subtitle>
            <v-list>
            <v-subheader>01-21.11.2019</v-subheader>
              <v-list-item-group color="transparent">
                <v-list-item> <v-icon>mdi-coins</v-icon>100</v-list-item>
                <v-list-item> <v-icon>mdi-coins</v-icon>100</v-list-item>
                <v-list-item> <v-icon>mdi-coins</v-icon>100</v-list-item>
              </v-list-item-group>
            </v-list>
            <v-card-actions>
              <v-btn text>Переглянути</v-btn>
            </v-card-actions>
          </v-card>-->
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Wallet',
	data: () => ({
		dialog: false,
		qrGen: 1,
		bonus: 0,
		generatedTokens: false,
		transferTokens: '',
		snackbar: false,
		recycleItems: '',
		transferPhone: '0500552618',
		sendCalc: false,
	}),
	computed: {
		...mapState({
			user: (state) => state.user,
			$db: (state) => state.db,
		}),
	},
	watch: {
		dialog(val) {
			if (!val) {
				this.generatedTokens = val;
			}
		},
	},
	mounted() {
		//check for message
		if (typeof this.$route.params.transferred != 'undefined') {
			this.snackbar = true;
		}
	},
	methods: {
		calcTokens(recycleItems) {
			if (recycleItems) {
				this.recycleItems = Number.parseInt(recycleItems);
				this.transferTokens = this.recycleItems * this.$rate;
				this.bonus = this.recycleItems * this.$bonusRate;
			}
		},
		qrGenerate(transferTokens) {
			if (transferTokens && transferTokens <= this.$store.state.user.tokens) {
				this.generatedTokens = true;
				let qr = this.$qrcode(0, 'H');
				let transfer = { fromid: 1, tokens: transferTokens, time: Date.now() };
				transfer = JSON.stringify(transfer);
				qr.addData(transfer);
				qr.make();
				this.$refs.qrHolder.innerHTML = qr.createImgTag(4);
			} else {
				this.transferTokens = 0;
				alert('Недостатньо зелених на рахунку');
			}
		},

		async sendTokens(transferTokens, transferPhone) {
			let db = this.$store.state.db;
			let senderUserId = this.$firebase.auth().currentUser.uid;
			let transferUserId = false;

			transferTokens = Number.parseInt(transferTokens);
			if (transferTokens && transferTokens <= this.$store.state.user.tokens) {
				if (transferPhone) {
					this.sendCalc = true;
					try {
						// сейчас может получиться несколько польщователей с одним номером, стоит добавить ограничение и использовать только первого найденного (на всякий случай) либо делать поддержку ситуаци с несколькими пользователями
						const query = await db
							.collection('users')
							.where('phone', '==', transferPhone)
							.limit(1)
							.get();

						await Promise.all(
							query.docs.map(async (doc) => {
								transferUserId = doc.id;
								return this.makeTransfer(
									senderUserId,
									transferUserId,
									transferTokens
								);
							})
						);
					} catch (error) {
						console.error('Error: ', error);
					} finally {
						this.sendCalc = false;
					}
				}
			} else {
				this.transferTokens = 0;
				alert('Недостатньо зелених на рахунку');
			}
		},

		async makeTransfer(senderUserId, transferUserId, transferTokens) {
			//get a user to transfer
			let db = this.$store.state.db;
			let transferBonus = this.bonus;
			let getSenderUserDocRef = db.collection('users').doc(senderUserId);
			let getReceiverUserDocRef = db.collection('users').doc(transferUserId);
			let saveRecycleTransaction = {
				binid: 1,
				fromid:senderUserId,
				bonus: this.bonus,
				bonusRate: this.$bonusRate,
				count: this.recycleItems,
				rate: this.$rate,
				// стоит или использовать аргумент или убрать его из функции
				// tokens: this.transferTokens,
				tokens: transferTokens,
				uid: transferUserId,
				time: Date.now(),
			};

			// db.collection("transactions").add({'fromid':senderUserId,'tokens':transferTokens, 'uid':transferUserId, 'time':Date. now()})
			try {
				const docRef = await db
					.collection('transactions')
					.add(saveRecycleTransaction);

				console.log(docRef);
				console.log('Transfer written with ID: ', docRef.id);

				//run transfer USER transaction
				// цель транзакций выполнить несколько операций в еденицу времени,
				// иначе пока обновляется аккаунт отправителя, другой запрос мог обновить аккаунт получателя и где-то сумма не сойдется
				const transaction = db
					.runTransaction(async (transaction) => {
						// This code may get re-run multiple times if there are conflicts.
						const getReceiverUserDoc = await transaction.get(
							getReceiverUserDocRef
						);
						const getSenderUserDoc = await transaction.get(getSenderUserDocRef);
						if (!getReceiverUserDoc.exists || !getSenderUserDoc.exists) {
							throw new Error(
								`${
									!getReceiverUserDoc.exists ? 'Receiver' : 'Sender'
								} document does not exist!`
							);
						}
						const newReceiverTokens =
							getReceiverUserDoc.data().tokens + transferTokens;
						const newReceiverBonus =
							getReceiverUserDoc.data().bonus + transferBonus;
						const receiverTr = transaction.update(getReceiverUserDocRef, {
							tokens: newReceiverTokens,
							bonus: newReceiverBonus,
						});

						const newSenderTokens =
							getSenderUserDoc.data().tokens - transferTokens;
						const senderTr = transaction.update(getSenderUserDocRef, {
							tokens: newSenderTokens,
						});

						return Promise.all([senderTr, receiverTr]);
					})
					.catch(function (error) {
						console.log('Transaction failed: ', error);
					});

				console.log('Transfer & get transaction successfully committed!');
				this.dialog = false;
				alert('Зараховано зелених: ' + transferTokens);
				//run transaction for transfer user
				//router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens}});
				return transaction;
			} catch (error) {
				//eslint-disable-next-line no-console
				console.error('Error adding document: ', error);
			}
		},
	},
};
</script>
