<template>
  <v-container style="height:500px">
    <v-layout
      text-center
      wrap
    >
      <v-flex>
        <v-snackbar class="text-center" top light color="white" v-model="snackbar">
            <v-alert color="green lighten-2" height="40" style="padding-top:7px"><v-icon>mdi-coins</v-icon>Зараховано зелених: {{$route.params.transferred}}</v-alert>
        </v-snackbar>

        <h1 class="headline" style="color:orange">
          Мій гаманець
        </h1>
        <div>
          <v-chip v-if="$store.state.user.tokens" text-color="#07C01A" color="transparent" style="margin-top:10px">
            <v-icon color="#07C01A" large>mdi-currency-usd-circle-outline</v-icon>
            <span class="display-1">{{$store.state.user.tokens}}</span>
          </v-chip>
           <v-chip v-else text-color="#07C01A" color="transparent" style="margin-top:10px">
            <v-icon color="#07C01A" large>mdi-currency-usd-circle-outline</v-icon>
              <span class="display-1">0</span>
          </v-chip>
        </div>  
        <br/>
        <div id="placeHolder"></div>
        <v-btn dark color="green" @click="dialog = true">Переказати <v-icon>mdi-currency-usd-circle-outline</v-icon></v-btn>
        <v-dialog v-model="dialog" color="#fff">
          <v-card>
            <v-card-title v-if="!generatedTokens">Введіть суму токенів</v-card-title>
            <v-card-text v-if="!generatedTokens">
              <v-text-field
                id="transferTokens"
                label="Введіть суму"
                solo
                outlined
                height="20"
                v-model="transferTokens"
              ></v-text-field>
              <v-btn text color="green" :disabled="!transferTokens" outlined @click="qrGenerate(transferTokens)">Створити <v-icon>mdi-qrcode-scan</v-icon></v-btn><br/>
             </v-card-text>

            <div id="qrHolderOuter" v-show="generatedTokens">
              <div class="text-center" >
                <v-alert color="green lighten-2" height="40" style="padding-top:7px">Покажіть QR-код отримувачу</v-alert>
              </div>
              <div id="qrHolder"></div>
            </div>  
           </v-card> 
        </v-dialog>  
        <br/><br/>
        <v-card>
          <v-tabs
            background-color="white"
            centered
            color="#07C01A"
          >
            <v-tab><v-icon>mdi-currency-usd-circle-outline</v-icon>Пропозиції</v-tab>
            <v-tab><v-icon>mdi-star-face</v-icon>Подарунки</v-tab>
            <v-tab-item>
                <v-banner one-line>
                <v-avatar
                  slot="icon"
                  size="40"
                >
                  <v-icon
                    icon="mdi-coffee"
                    color="#8b6138"
                  >
                    mdi-coffee
                  </v-icon>
                </v-avatar>
                <div class="headline text-left">Кава</div>
                <p>100% Арабіка,250 мл</p>
                <template v-slot:actions>
                  <v-chip text-color="orange" color="transparent">
                   <v-icon color="#07C01A">mdi-currency-usd-circle-outline</v-icon>
                      100
                  </v-chip> 
                  <v-btn text color="green accent-4">незабаром</v-btn>
                </template>
              </v-banner>

              <v-banner one-line>
                <v-avatar
                  slot="icon"
                  color="ref"
                  size="40"
                >
                  <v-icon
                    icon="mdi-ticket"
                    color="green"
                    size="40"
                  >
                    mdi-cellphone
                  </v-icon>
                </v-avatar>
                <div class="headline text-left">Поповнення</div>
                <p>Екотариф. 45 грн</p>
                <template v-slot:actions>
                  <v-chip text-color="orange" color="transparent">
                   <v-icon color="#07C01A">mdi-currency-usd-circle-outline</v-icon>
                      50
                  </v-chip> 
                  <v-btn text color="green accent-4">незабаром</v-btn>
                </template>
              </v-banner>

            </v-tab-item> 
            <v-tab-item>
              <div class="text-center">
                <v-alert border="bottom"
                  colored-border
                  type="warning"
                  elevation="2">
                Кількість бонусних подарунків обмежена</v-alert>
              </div>
               <v-banner one-line>
                <v-avatar
                  slot="icon"
                  color="green"
                  size="40"
                >
                  <v-icon
                    icon="mdi-ticket"
                    color="white"
                  >
                    mdi-ticket
                  </v-icon>
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
export default {
   name: 'Wallet',
   data: () => ({
     dialog: false,
     qrGen:1,
     bonus:0,
     generatedTokens:false,
     transferTokens:'',
     snackbar:false
   }),
   async mounted(){
    //check for message 
    if(typeof(this.$route.params.transferred) != 'undefined'){
      this.snackbar = true;
    }     
   },
   watch: {
    dialog(val) {
        if(!val){
          this.generatedTokens = val;  
          this.transferTokens = '';
        }
      },
  },
   methods: {
     qrGenerate(transferTokens){
        if(transferTokens && transferTokens <= this.$store.state.user.tokens){
          this.generatedTokens = true;
          let qr = this.$qrcode(0, 'H'); 
          let transfer = {fromid:1, tokens:transferTokens,  time:Date. now()};
          transfer = JSON.stringify(transfer);
          qr.addData(transfer);
          qr.make();
          setTimeout(
            function(){
              document.getElementById('qrHolder').innerHTML = qr.createImgTag(4);
            }, 500
          );
        } else {
          this.transferTokens=0;
          alert('Недостатньо зелених на рахунку');
        } 
     }
   }
  }
</script>
