/* eslint-disable */
<template>
	<v-container>
		<v-layout text-center wrap id="deals-list">
			<v-flex>
				<h1 class="headline" style="color:orange">Трансакції</h1>	
				<v-card class="deal-item text-center" v-for="deal in deals" :key="deal.id" max-width="400">
					<v-row>{{deal.date.getDate()}}/{{(deal.date.getMonth()+1)}}/{{deal.date.getFullYear()}} {{deal.date.getHours()}}:{{String(deal.date.getMinutes()).padStart(2, "0")}}</v-row>
					<v-row>Нараховано зелених:<strong>{{deal.tokens}}</strong></v-row>
					<v-row>користувачу: <strong>{{deal.email}}</strong></v-row>
					<v-row v-if="deal.pet['value']">
						Pet-пляшка: {{deal.pet['value']}} {{pcs[deal.pet['pcs']]}}
					</v-row>
					<v-row v-if="deal.hdpe['value']">
						HDPE: {{deal.hdpe['value']}} {{pcs[deal.hdpe['pcs']]}}
					</v-row>
					<v-row v-if="deal.glass['value']">
						Скло: {{deal.glass['value']}} {{pcs[deal.glass['pcs']]}}
					</v-row>
					<v-row v-if="deal.carton['value']">
						Картон: {{deal.carton['value']}} {{pcs[deal.carton['pcs']]}}
					</v-row>
					<v-row v-if="deal.metall['value']">
						Метал: {{deal.metall['value']}} {{pcs[deal.metall['pcs']]}}
					</v-row>
					<v-row v-if="deal.aluminium['value']">
						Алюміній: {{deal.aluminium['value']}} {{pcs[deal.aluminium['pcs']]}}
					</v-row>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		deals:[],
		pcs:{'pcs':'шт','kg':'кг'},
		raw:[]
	}),
	async created(){
		//let getDeals = this.$store.state.db.collection('transactions');
		let startDate = new Date('2021-02-20');
		let userTransactions = await this.$store.state.db.collection('transactions').where('date','>',startDate).orderBy('date', 'desc').get();
		userTransactions.forEach(async(th) => {
		//eslint-disable-next-line no-console
		await this.$store.state.db.collection('users').doc(th.data().uid).get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {
					this.deals.push({
						'email':docSnapshot.data().email, 
						'tokens':th.data().tokens, 
						'pet':th.data().rawMaterials[0],
						'hdpe':th.data().rawMaterials[1],
						'glass':th.data().rawMaterials[2],
						'carton':th.data().rawMaterials[3],
						'metall':th.data().rawMaterials[4],
						'aluminium':th.data().rawMaterials[5],
						'date':new Date(th.data().date.seconds * 1000)
					})
				} else {
					this.deals.push({
						'email':th.data().uid, 
						'tokens':th.data().tokens, 
						'pet':th.data().rawMaterials[0],
						'hdpe':th.data().rawMaterials[1],
						'glass':th.data().rawMaterials[2],
						'carton':th.data().rawMaterials[3],
						'metall':th.data().rawMaterials[4],
						'aluminium':th.data().rawMaterials[5],
						'date':new Date(th.data().date.seconds * 1000)
					})
				}
			});
		});
    },
	methods: {		
	},
};
</script>