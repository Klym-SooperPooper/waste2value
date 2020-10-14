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
           <h1 class="headline" style="color:orange">
              Нагадати пароль
           </h1>
           <div>
             <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field outlined id="emailField" label="Введіть email" :rules="emailRules"></v-text-field>
                <v-btn @click="validateForm">Нагадати пароль</v-btn>
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
    emailRules: [
        v => /.+@.+/.test(v) || 'Невірний e-mail',
    ],
    formIsValid:false
  }),
  mounted(){
    
  },
  methods:{
    validateForm(){
        if (this.$refs.form.validate()) {
          this.formIsValid = true;
          this.sendEmail();
        } else{
          this.formIsValid = false;
        }
     },
     sendEmail(){
       let ref = this;
        this.$firebase.auth().sendPasswordResetEmail(document.getElementById('emailField').value).then(function() {
          // Email sent.
          alert('e-mail надіслано');
          ref.$router.push({path:'signup', name:'Signup', params:{resetpass:1}});
        }).catch(function(error) {
          console.log(error);
          alert('Сталася помилка: '+error);
          // An error happened.
        });
     }
  }
};

</script>