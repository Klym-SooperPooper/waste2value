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
        <div v-if="qrseen">
          <v-alert color="orange lighten-2" style="padding-top:7px"><v-icon>mdi-qrcode-scan</v-icon>Наведіть на екран на контейнері для автоматичного сканування</v-alert>
          <qrcode-stream @decode="onDecode" height="100"></qrcode-stream>
        </div>
        <v-btn v-if="!qrseen" v-on:click="qrseen = !qrseen" x-large color="success" dark>Сканувати QR-код</v-btn>
        </v-flex>
     </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    qrseen:false
  }),
  mounted (){
    /*var qr = this.$qrcode(0, 'H');
    var transaction = {binid:1, count:1,  time:Date. now()};
    var transfer = {fromid:1, tokens:1,  time:Date. now()};
    transaction = JSON.stringify(transaction);
    //eslint-disable-next-line no-console
    console.log(transaction);
    qr.addData(this.$encryptor.encrypt(JSON.stringify(transaction)));
    qr.make();
    document.getElementById('placeHolder').innerHTML = qr.createImgTag();*/
  },
  methods: {
     IsJsonString(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false;
        }
    },
    onDecode (decodedString) {
      if(decodedString){
        //this.$router.push('Wallet')
        //var decrypted = this.$encryptor.decrypt(decodedString);
        //eslint-disable-next-line
        decodedString = this.IsJsonString(decodedString);
        let router = this.$router;
        if(typeof decodedString === 'object'){
          //TRANSFER
          if(typeof decodedString.tokens !== 'undefined'){
            //alert('Get your '+decodedString.tokens+' tokens from '+decodedString.fromid+' !');
            //add owner of transaction
            decodedString.uid = this.$firebase.auth().currentUser.uid;
            this.$store.state.db.collection("transactions").add(decodedString)
            .then(function(docRef) {
               //eslint-disable-next-line no-console
                console.log("Document written with ID: ", docRef.id);
                router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens}});
            })
            .catch(function(error) {
              //eslint-disable-next-line no-console
                console.error("Error adding document: ", error);
            });
           //RECYCLE transaction 
          } else if(typeof decodedString.count !=='undefined'){
            //let recycleTime = new Date(decodedString.time);
           // alert('Thanks for '+decodedString.count+' '+recycleTime.getDate()+' '+(recycleTime.getMonth()+1)+' '+recycleTime.getFullYear());
            //add owner of transaction
            decodedString.uid = this.$firebase.auth().currentUser.uid;
            //calc rates
            decodedString.tokens = this.$rate*decodedString.count;
            decodedString.rate = this.$rate;
            //calc bonuses
            decodedString.bonus = this.$bonusRate*decodedString.count;
            decodedString.bonusRate = this.$bonusRate;
            this.$store.state.db.collection("transactions").add(decodedString)
            .then(function(docRef) {
               //eslint-disable-next-line no-console
                console.log("Document written with ID: ", docRef.id);
                router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens, 'bonus':decodedString.bonus}});
            })
            .catch(function(error) {
              //eslint-disable-next-line no-console
                console.error("Error adding document: ", error);
            });
          } else {
            alert('QR error');
          }
        } else {
          alert('QR error');
        }
      }
    }
  }
};
</script>
