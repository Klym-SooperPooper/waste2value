/* eslint-disable */
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
           <div>
             <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field outlined id="userName" v-if="activeTab=='register'" v-model="uName" type="text" hint="мінімум 8 символів" :rules="[rules.required]" label="Ваш нікнейм" @change="validateForm"></v-text-field>
                <v-text-field outlined id="emailField" label="Введіть email" :rules="emailRules" @change="validateForm"></v-text-field>
                <v-text-field outlined id="passField" v-if="activeTab=='register'" v-model="password" type="password" hint="мінімум 8 символів" :rules="[rules.required, rules.min, passwordConfirmationRule]" label="Введіть пароль" @change="validateForm"></v-text-field>
                <v-text-field outlined id="passField" v-else v-model="password" type="password" hint="мінімум 8 символів" :rules="[rules.required, rules.min]" label="Введіть пароль" @change="validateForm"></v-text-field>
                <v-text-field outlined id="repassField" v-if="activeTab=='register'" v-model="rePassword" type="password" hint="мінімум 8 символів" :rules="[rules.required, rules.min]" label="Підтвердіть пароль" @change="validateForm"></v-text-field>
                <v-btn @click="checkForSignInUser" :disabled="!formIsValid">Увійти</v-btn>
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
    emailRules: [
        v => /.+@.+/.test(v) || 'Невірний e-mail',
    ],
    rules: {
        required: value => !!value || 'Обов`язкове поле.',
        min: 6
    }, 
    formIsValid:false
  }),
  mounted(){
    //check if signed up for avatar
    //add avatar or dismiss 
    if(typeof(this.$route.params.logout) != 'undefined'){
      this.activeTab = 'login';
      this.logout = this.$route.params.logout;
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
       let usersRef = this.$store.state.db.collection("users");
       let firebaseAuth = this.$firebase;
       let redirect = this.$router;
       let ref = this;
       this.$firebase.auth().createUserWithEmailAndPassword(email, password).then(
         ()=>{
           usersRef.doc(firebaseAuth.auth().currentUser.uid).set({'email':email, 'name':userName, tokens:0, bonus:0}).then(
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