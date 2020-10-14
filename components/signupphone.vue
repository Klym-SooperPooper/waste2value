<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
         <template>
           <v-tabs color="orange" centered="" v-model="activeTab">
            <v-tab :href="`#register`">Реєстрація</v-tab>
            <v-tab :href="`#login`">Логін</v-tab>
           </v-tabs>
           <br/>
           <div class="text-center" v-if="logout">
            <v-alert color="orange lighten-2" height="40" style="padding-top:7px">Ви вийшли з акаунту</v-alert>
          </div>
           <div v-show="!verified">
              <v-text-field outlined id="number" label="Введіть номер мобільного" prefix="+38" :rules="phoneRules"></v-text-field>
              <div id="recaptcha-container"></div>
              <v-btn @click="phoneAuth">відправити SMS</v-btn>
           </div>
           <div v-show="verified">
              <v-text-field outlined id="verificationCode" label="Введіть SMS-код" :rules="smsRules"></v-text-field>
              <v-btn @click="codeverify">Підтвердити SMS-код</v-btn>
              <v-btn @click="phoneAuth" text>Надіслати SMS ще раз</v-btn>
           </div>
          </template>
      </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'signup',
  data: () => ({
    recaptchaVerifier:'',
    confirmationResult:'',
    codeResult:'',
    verified:false,
    logout:false,
    phoneRules: [
        v => !!v || 'Обов`язкове поле'
    ],
    smsRules: [
        v => !!v || 'Обов`язкове поле'
    ],
    activeTab:'register'
  }),
  mounted(){
    if(typeof(this.$route.params.logout) != 'undefined'){
      this.activeTab = 'login';
      this.logout = this.$route.params.logout;
    }
    this.reCaptcha();
    //check if signed up for avatar
    //add avatar or dismiss 
  },
  methods:{
    reCaptcha(){
       this.recaptchaVerifier = new this.$firebase.auth.RecaptchaVerifier('recaptcha-container');
       this.recaptchaVerifier.render();
     },
     codeverify(){
       var firebaseAuth = this.$firebase;  
       var verificationId = this.codeResult.verificationId;
       var code = document.getElementById('verificationCode').value;
       var redirect = this.$router;
       console.log('codeResult');
       console.log(this.codeResult);
       let store = this.$store;
       this.codeResult.confirm(code).then(
         function(){
            //eslint-disable-next-line no-console
            console.log('here signed up');
             //eslint-disable-next-line no-console
            console.log(firebaseAuth.auth().currentUser.uid);
            var credential = firebaseAuth.auth.PhoneAuthProvider.credential(verificationId, code);
            firebaseAuth.auth().signInWithCredential(credential);

            let usersRef = store.state.db.collection("users").doc(firebaseAuth.auth().currentUser.uid);
            usersRef.get()
              .then((docSnapshot) => {
                if (!docSnapshot.exists) {
                  usersRef.set({'phone':document.getElementById('number').value, tokens:0, bonus:0}).then(
                    ()=>{
                      //redirect to account
                      redirect.push({path:'profile', name:'Profile', params:{signedup:1}});
                    }
                  ) // create the document
                } else {
                  //redirect to account
                  redirect.push({path:'profile', name:'Profile', params:{signedup:1}});
                }
            });
         }
       ).catch(
         function(error){
           console.log(error.message);
           document.getElementById('verificationCode').value = '';
           alert('Невірний код');
         }
       );
     },
     phoneAuth(){
       var number = '+38'+document.getElementById('number').value;
       if(number){
          this.$firebase.auth().signInWithPhoneNumber(number,this.recaptchaVerifier).then(
            confirmResult =>{console.log(confirmResult); this.codeResult = confirmResult; 
            this.verified = true;
            setTimeout(
              function(){
              document.getElementById("verificationCode").value='';
              },500
            );
            }
          ).catch(
            function(error){
              console.log(error.message);
            }
          );
       }
     }
  }
};
</script>