<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="60"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="headline" style="color:orange">
          Сканувати QR
        </h1>
        <br/>
          <v-stepper v-model="e3" vertical>
             <v-stepper-step color="orange" :complete="e3 > 1" step="1">
                Зараз біля контейнера?
                <small>Підтвердіть місцезнаходження</small>
              </v-stepper-step>

              <v-stepper-content step="1">
                  <v-card color="#ebfbed" class="mb-12" height="125px">
                   <v-icon x-large color="green" style="margin-top:40px">mdi-map-marker-check</v-icon>
                  </v-card>
                <v-btn color="green" @click="e3 = 2" dark>Так</v-btn>
                <v-btn text>Ні</v-btn>
              </v-stepper-content>

              <v-stepper-step color="orange" :complete="e3 > 2" step="2">
                Кидайте пляшки одна за одною у контейнер
                <small>Тицніть отримати QR-код після завершення</small>
              </v-stepper-step>

              <v-stepper-content step="2">
                <v-card color="#ebfbed" class="mb-12" height="125px">
                   <v-icon x-large color="green" style="margin-top:40px">mdi-arrow-down-bold-box</v-icon>
                  </v-card>
                 Завершили? 
                <v-btn color="green" @click="e3 = 3" dark>Так</v-btn>
                <v-btn text>Ні</v-btn>
              </v-stepper-content>

              <v-stepper-step color="orange" :complete="e3 > 3" step="3">
                Відскануйте QR-код на контейнері
              </v-stepper-step>

              <v-stepper-content step="3">
                <qrcode-stream @decode="onDecode"></qrcode-stream>
                Наведіть на екран на контейнері для автоматичного сканування
              </v-stepper-content>
              <v-stepper-step color="orange" :complete="e3 > 4" step="4">
                Зарахування токенів
              </v-stepper-step>
             </v-stepper>
      </v-flex>

     </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'foo',

  data: () => ({
     e3: 1    
  }),
  methods: {
    onDecode (decodedString) {
      if(decodedString){
        this.e3=4;
        //window.location.href="/wallet";
        this.$router.push('Wallet')
      }
    }
  }
};
</script>
