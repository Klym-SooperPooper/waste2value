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
            <span class="display-1">{{myWallet}}</span>
           </v-chip>
           <v-chip v-else text-color="#07C01A" color="transparent" style="margin-top:10px">
            <v-icon color="#07C01A" large>mdi-currency-usd-circle-outline</v-icon>
              <span class="display-1">0</span>
          </v-chip>
        </div>  
        <br/>
        <div id="placeHolder"></div>
        <v-btn dark color="green" @click="dialog = true">Нарахувати зелені <v-icon>mdi-currency-usd-circle-outline</v-icon></v-btn>
        <v-dialog v-model="dialog" color="#fff">
          <v-card>
            <v-card-title v-if="!generatedTokens">Введіть суму токенів</v-card-title>
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
              <v-btn text color="green" :disabled="(!transferTokens&&!transferPhone) || sendCalc" outlined @click="sendTokens(transferTokens,transferPhone)">Надіслати бонуси</v-btn><br/>
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
     snackbar:false,
     myWallet:0,
     recycleItems:'',
     transferPhone:'0500552618',
     sendCalc:false
   }),
   created(){
    let ref = this;
    let db = this.$store.state.db;
    db.collection("users").doc(this.$firebase.auth().currentUser.uid)
    .onSnapshot(function(doc) {
        ref.myWallet = doc.data().tokens;
        //console.log("Current data: ", doc.data());
    });

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
     calcTokens(recycleItems){
       if(recycleItems){
         this.recycleItems = Number.parseInt(recycleItems)
         this.transferTokens = this.recycleItems*this.$rate;
         this.bonus  = this.recycleItems*this.$bonusRate;
      }
     },
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
     },
     sendTokens(transferTokens, transferPhone){
       this.sendCalc = true;
       let db = this.$store.state.db;
       let senderUserId = this.$firebase.auth().currentUser.uid;
       let transferUserId = false;
       let ref = this;
      
       transferTokens = Number.parseInt(transferTokens);
       if(transferTokens && transferTokens <= this.$store.state.user.tokens){
          if(transferPhone){
            db.collection("users").where('phone','==', transferPhone).get().then(
              function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  transferUserId = doc.id;
                  ref.makeTransfer(senderUserId,transferUserId, transferTokens);
                }
                )
              }).catch(function(error) {
                //eslint-disable-next-line no-console
                  console.error("Error: ", error);
              });
          }
        } else {
          this.transferTokens=0;
          alert('Недостатньо зелених на рахунку');
        } 
     },

     makeTransfer(senderUserId, transferUserId, transferTokens){
       //get a user to transfer
      let db = this.$store.state.db; 
      let ref = this;
      let transferBonus = this.bonus;
      let getTransferUserDocRef = db.collection('users').doc(transferUserId);
      let getSenderUserDocRef = db.collection('users').doc(senderUserId);
      let saveRecycleTransaction = {'binid':1, 'bonus':this.bonus, 'bonusRate':this.$bonusRate, 'count':this.recycleItems, 'rate':this.$rate, 'tokens':this.transferTokens, 'uid':this.$firebase.auth().currentUser.uid, 'time':Date.now()};                
      
      // db.collection("transactions").add({'fromid':senderUserId,'tokens':transferTokens, 'uid':transferUserId, 'time':Date. now()})
      db.collection("transactions").add(saveRecycleTransaction)
      .then(function(docRef) {
        //eslint-disable-next-line no-console
          console.log(docRef);
          console.log("Transfer written with ID: ", docRef.id);
          
          //run transfer USER transaction
          return db.runTransaction(function(transaction) {
              // This code may get re-run multiple times if there are conflicts.
              //eslint-disable-next-line
              return transaction.get(getTransferUserDocRef).then(function(getUserDocWallet) {
                  if (!getUserDocWallet.exists) {
                      throw "Document does not exist!";
                  }
                  var newTokens = getUserDocWallet.data().tokens + transferTokens;
                  var newBonus = getUserDocWallet.data().bonus + transferBonus;
                  //eslint-disable-next-line
                  transaction.update(getTransferUserDocRef, { tokens: newTokens, bonus: newBonus });
                  console.log("user "+getUserDocWallet.id+" got "+newTokens+" tokens");
              });
          }).then(function() {
              console.log("run sender USER transaction");
              //run sender USER transaction
              return db.runTransaction(function(transaction) {
                  // This code may get re-run multiple times if there are conflicts.
                  //eslint-disable-next-line
                  return transaction.get(getSenderUserDocRef).then(function(getSenderUserDoc) {
                      if (!getSenderUserDoc.exists) {
                          throw "Document does not exist!";
                      }
                      var newTokens = getSenderUserDoc.data().tokens - transferTokens;
                      //eslint-disable-next-line
                      transaction.update(getSenderUserDocRef, { tokens: newTokens });
                      console.log("user "+getSenderUserDoc.id+" transferred "+newTokens+" tokens");
                  });
              }).then(function() {
                  console.log("Transfer & get transaction successfully committed!");
                  ref.dialog = false;
                  alert('Зараховано зелених: '+ref.transferTokens);
                  //run transaction for transfer user
                  //router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens}});
              }).catch(function(error) {
                  console.log("Transaction failed: ", error);
              });
          }).catch(function(error) {
              console.log("Transaction failed: ", error);
          });
      })
      .catch(function(error) {
        //eslint-disable-next-line no-console
          console.error("Error adding document: ", error);
      });
     }
   }
  }
</script>
