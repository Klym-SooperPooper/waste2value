

<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
          <h1 class="headline" style="color:orange">
            Рейтинг еко-чемпіонів
          </h1>
          <div class="item-like" v-for="item in transactions" :key="item.id">
            <span>{{item.displayName}} - {{item.tokens}}</span>
          </div> 

          <v-banner sticky>
              <div color="#07C01A">
                Заробляй <v-icon color="orange" small>mdi-star</v-icon>+70 щодня, завдяки активним діям і отримай <br/><v-icon color="green">mdi-medal</v-icon> <span class="headline">статус eco-чемпіона!</span>
                <div style="border:2px solid green; width:200px; margin:6px auto;background:#E9F6EA;">
                  <v-icon color="green">mdi-bottle-soda-classic</v-icon>
                  <v-icon color="green">mdi-bottle-soda-classic</v-icon>
                  <v-icon color="green">mdi-bottle-soda-classic</v-icon>
                  <v-icon color="green">mdi-bottle-soda-classic</v-icon>
                  <v-icon color="green">mdi-bottle-soda-classic</v-icon>
                  <v-icon color="orange">mdi-bottle-soda-classic</v-icon>
                  <v-icon color="orange">mdi-bottle-soda-classic</v-icon>
                </div>
                Сьогодні, 22.11.2019 залишилось зібрати <strong>2</strong> пляшки  
              </div>
          </v-banner>
          <template>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left"><small>Place</small></th>
                    <th class="text-left"><small>Name</small></th>
                    <th class="text-left"><v-icon small color="orange">mdi-star</v-icon></th>
                    <th class="text-left"><v-icon color="#07C01A" small>mdi-coin-outline</v-icon></th>
                  </tr>
                </thead>
                <tbody>
                  <tr bgcolor="#E9F6EA" v-for="item in transactions" :key="item.id">
                    <td class="text-left"><v-chip color="transparent"><v-icon color="orange" x-small>mdi-medal</v-icon>1</v-chip></td>
                    <td class="text-left"><v-icon>mdi-face-profile</v-icon>{{item.displayName}}</td>
                    <td class="text-left">+900</td>
                    <td class="text-left">{{item.tokens}}</td>
                  </tr>
                  <!--
                  <tr>
                    <td class="text-left"><v-chip color="transparent"><v-icon color="#07C01A" x-small>mdi-medal</v-icon>2</v-chip></td>
                    <td class="text-left"><v-icon>mdi-face-profile</v-icon>Klim</td>
                    <td class="text-left">+800</td>
                    <td class="text-left">200</td>
                  </tr>

                  <tr>
                    <td class="text-left"><v-chip color="transparent"><v-icon color="#07C01A" x-small>mdi-medal</v-icon>3</v-chip></td>
                    <td class="text-left"><v-icon>mdi-face-profile</v-icon>Vasya</td>
                   <td class="text-left">+700</td>
                    <td class="text-left">150</td>
                  </tr>

                  <tr>
                    <td class="text-left"><v-chip color="transparent"><v-icon color="#07C01A" x-small>mdi-arrow-up</v-icon>4</v-chip></td>
                    <td class="text-left"><v-icon>mdi-face-profile</v-icon>Vasya</td>
                    <td class="text-left">+500</td>
                    <td class="text-left">100</td>
                  </tr>

                  <tr>
                    <td class="text-left"><v-chip color="transparent"><v-icon color="#07C01A" x-small>mdi-arrow-down</v-icon>5</v-chip></td>
                    <td class="text-left"><v-icon>mdi-face-profile</v-icon>Vasya</td>
                    <td class="text-left">+400</td>
                    <td class="text-left">75</td>
                  </tr>
                  -->
                </tbody>
              </template>
            </v-simple-table>
          </template>
      </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'foo',

  data: () => ({
    transactions:[],
    recaptchaVerifier:'',
    confirmationResult:'',
    codeResult:''
  }),
  async created(){
   /*this.$store.state.db.collection('transactions').onSnapshot((querySnapshot) => {
      this.transactions = querySnapshot.docs.map(doc => ({
              'id': doc.id,
              'tokens': doc.data().tokens
            })
      );
    }, function(error) {
        //...
        console.log('error'+error);
    });*/
    let userTransactions = await this.$store.state.db.collection('transactions').get();
    userTransactions.forEach(async(th) => {
      //eslint-disable-next-line no-console
      let users = await this.$store.state.db.collection('users').doc(th.data().uid).get();
      this.transactions.push({'displayName':users.data().name, 'tokens':th.data().tokens})
    });
  },
  mounted(){
  },  
  methods: {
     
   }
};
</script>
