/* eslint-disable */
<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo2.png')"
          class="my-3"
          contain
          height="100"
        ></v-img>
      </v-flex>
      <v-flex xs12>
         <template>
           <div class="text-center" v-if="resetpass">
            <v-alert color="green lighten-2" style="padding-top:7px">Перевірте свій e-mail для встановлення нового паролю</v-alert>
           </div>
           <v-tabs color="orange" centered="" v-model="activeTab">
            <v-tab :href="`#register`">Реєстрація</v-tab>
            <v-tab :href="`#login`">Логін</v-tab>
           </v-tabs>
           <br/>
           
           <div class="text-center" v-if="logout">
            <v-alert color="orange lighten-2" height="40" style="padding-top:7px">Ви вийшли з акаунту</v-alert>
          </div>
           <div>
             <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field outlined id="userName" v-if="activeTab=='register'" v-model="uName" type="text" hint="мінімум 8 символів" :rules="[rules.required]" label="Ваш нікнейм" @change="validateForm"></v-text-field>
                <v-text-field outlined id="emailField" label="Введіть email" :rules="emailRules" @change="validateForm"></v-text-field>
                <v-text-field outlined id="userPhone" v-if="activeTab=='register'" label="Введіть телефон" type="number" @change="validateForm" :rules="[phoneRules.required, phoneRules.min]"></v-text-field>
                <v-text-field outlined id="passField" v-if="activeTab=='register'" v-model="password" type="password" hint="мінімум 8 символів" :rules="[rules.required, rules.min, passwordConfirmationRule]" label="Введіть пароль" @change="validateForm"></v-text-field>
                <v-text-field outlined id="passField" v-else v-model="password" type="password" hint="мінімум 8 символів" :rules="[rules.required, rules.min]" label="Введіть пароль" @change="validateForm"></v-text-field>
                <v-text-field outlined id="repassField" v-if="activeTab=='register'" v-model="rePassword" type="password" hint="мінімум 8 символів" :rules="[rules.required, rules.min]" label="Підтвердіть пароль" @change="validateForm"></v-text-field>
                <v-btn @click="checkForSignInUser" v-if="activeTab=='register'">Зареєструватись</v-btn>
                <v-btn @click="checkForSignInUser" v-else>Увійти</v-btn>
                <br/> <br/>
                 <v-btn  v-if="activeTab=='login'" color="orange" link icon to="/resetpass" small>
                  Нагадати пароль
                </v-btn>
             </v-form>
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
    uName:'',
    logout:false,
    valid:true,
    activeTab:'register',
    password:'',
    rePassword:'',
    resetpass:false,
    emailRules: [
        v => /.+@.+/.test(v) || 'Невірний e-mail',
    ],
    rules: {
        required: value => !!value || 'Обов`язкове поле.',
        min: 8
    }, 
    phoneRules: {
        required: value => !!value || 'Обов`язкове поле.',
        min: 10
    },
    formIsValid:false
  }),
  mounted(){
    //check if signed up for avatar
    //add avatar or dismiss 
    if(typeof(this.$route.params.logout) != 'undefined' || typeof(this.$route.params.resetpass) != 'undefined'){
      this.activeTab = 'login';
      this.logout = this.$route.params.logout;
    }
    if(typeof(this.$route.params.resetpass) != 'undefined'){
      this.resetpass = 1;
    }
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.rePassword || "Паролі повинні співпадати";
    },
  },
  methods:{
     validateForm(){
        if (this.$refs.form.validate()) {
          this.formIsValid = true;
        } else{
          this.formIsValid = false;
        }
     },
     checkForSignInUser(){
       if(this.activeTab == 'register'){
         this.emailAuth();
       } else {
         this.emailLogin();
       }
     },
     emailAuth(){
       let email = document.getElementById('emailField').value;  
       let password = document.getElementById('passField').value;  
       let userName = document.getElementById('userName').value;  
       let userPhone = document.getElementById('userPhone').value;  
       let usersRef = this.$store.state.db.collection("users");
       let firebaseAuth = this.$firebase;
       let redirect = this.$router;
       let ref = this;
       this.$firebase.auth().createUserWithEmailAndPassword(email, password).then(
         ()=>{
           usersRef.doc(firebaseAuth.auth().currentUser.uid).set({'email':email, 'name':userName, 'phone':userPhone.toString(), tokens:0, bonus:0}).then(
              ()=>{
                //redirect to account
                redirect.push({path:'profile', name:'Profile', params:{signedup:1}});
              }
            )
         }
       ).catch(function(error) {
             // Handle Errors here.
            //var errorCode = error.code;
            //var errorMessage = error.message;
            console.log(error.message);
            if(error.code == 'auth/email-already-in-use'){
              alert('Ви вже зареєстровані');
              ref.emailLogin();
            }
        });
     },
     emailLogin(){
       let email = document.getElementById('emailField').value;  
       let password = document.getElementById('passField').value;
       let redirect = this.$router;
       this.$firebase.auth().signInWithEmailAndPassword(email, password).then(
         ()=>{
            redirect.push({path:'profile', name:'Profile', params:{signedup:1}});
         }
       ).catch(function(error) {
          // Handle Errors here.
          //var errorCode = error.code;
          //var errorMessage = error.message;
          alert(error.message);
        });
     }
  }
};

</script>