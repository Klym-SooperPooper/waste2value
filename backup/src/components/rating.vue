<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
          <h1 class="headline" style="color:orange">
            Рейтинг2 еко-чемпіонів
          </h1>
         
          <div color="#07C01A">
            Заробляй <v-icon color="orange" small>mdi-star</v-icon>бонуси щодня, завдяки активним діям і отримай <br/><v-icon color="green">mdi-medal</v-icon> <span class="headline">статус eco-чемпіона!</span>
            <div style="border:2px solid green; width:200px; margin:6px auto;background:#E9F6EA;">
              <v-icon color="green">mdi-bottle-soda-classic</v-icon>
              <v-icon color="green">mdi-bottle-soda-classic</v-icon>
              <v-icon color="green">mdi-bottle-soda-classic</v-icon>
              <v-icon color="green">mdi-bottle-soda-classic</v-icon>
              <v-icon color="green">mdi-bottle-soda-classic</v-icon>
              <v-icon color="orange">mdi-bottle-soda-classic</v-icon>
              <v-icon color="orange">mdi-bottle-soda-classic</v-icon>
            </div>
            <!--
            Сьогодні, 22.11.2019 залишилось зібрати <strong>2</strong> пляшки  -->
          </div>
          <template>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left"><small>Місце</small></th>
                    <th class="text-left"><small>Ім`я</small></th>
                    <th class="text-left"><v-icon small color="orange">mdi-star</v-icon><small>Бонуси</small></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user,index) in ratings" :key="user.id">
                    <td class="text-left" v-bind:class="'place'+(index+1)">
                      <v-chip color="transparent">
                        <v-icon v-if="index==0" color="orange" x-small>mdi-medal</v-icon>
                        <v-icon v-if="index<3 && index>0" color="green" x-small>mdi-medal</v-icon>
                        {{index+1}}
                      </v-chip>  
                    </td>
                    <td class="text-left" v-bind:class="'place'+(index+1)">
                      <v-chip color="transparent">
                         <v-avatar size="32px">
                            <v-icon v-if="!user.avatar">mdi-face-profile</v-icon>
                             <v-img v-else v-bind:src="user.avatar" width="20"></v-img> 
                         </v-avatar>
                        {{user.name}}
                      </v-chip>
                    </td>
                    <td class="text-left" v-bind:class="'place'+(index+1)">{{user.bonus}}</td>
                  </tr>
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
    ratings:[],
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
    let userRates = await this.$store.state.db.collection('users').orderBy("bonus", "desc").get();
    userRates.forEach(async(user) => {
      //eslint-disable-next-line no-console
      this.ratings.push({'name':user.data().name, 'avatar':user.data().avatar, 'tokens':user.data().tokens, 'bonus':user.data().bonus})
    });
  },
  mounted(){
  },  
  methods: {
     
   }
};
</script>