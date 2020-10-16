<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
         <template>
           <div>
          <h1  class="headline" style="color:orange">Мій профіль</h1> 
          <v-btn absolute="" top right small
            id="signOutBtn"
            color="success"
            outlined=""
            class="mr-4"
            @click="signOut"
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
          </div>
          <br/>
          <div class="text-center" v-if="signedup">
            <v-alert color="green lighten-2" height="40" style="padding-top:7px">Вітаємо у BeEco!</v-alert>
          </div>
          <div class="text-center" v-if="!$store.state.user.email">
            <v-alert color="orange lighten-2" style="padding-top:7px"><v-icon>mdi-email</v-icon>Вкажіть свій e-mail на випадок зміни номеру телефона</v-alert>
          </div>
          <div class="text-center" v-if="avatarUploaded">
            <v-alert color="green lighten-2" height="40" style="padding-top:7px">Аватар оновлено!</v-alert>
          </div>
          <img id='profileAvatar' v-if="$store.state.user.avatar" v-bind:src="$store.state.user.avatar" width="150" />
          <img id='profileAvatar' v-else src="" width="150" />
          <v-form ref="form" v-model="valid" lazy-validation>
              <v-file-input outlined id="avatarUpload" label="Загрузить аватар" accept="image/*" @change="uploadAvatar($event)"></v-file-input>
              <v-text-field v-model="$store.state.user.name" outlined id="userName" label="Имя" :rules="nameRules" @change="validateForm" required></v-text-field>
              <v-text-field v-model="$store.state.user.email" outlined id="userEmail" label="E-mail" :rules="emailRules" @change="validateForm"></v-text-field>
              <div class="text-center" v-if="updated">
                <v-alert color="green lighten-2" height="40" style="padding-top:7px">Інформацію оновлено!</v-alert>
              </div>
              <v-btn
                id="submitForm"
                :disabled="!formIsValid"
                color="success"
                class="mr-4"
                @click="saveInfo"
              >
                Зберегти
              </v-btn>
            </v-form> 
          </template>
      </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Profile',
  data: () => ({
    signedup:false,
    avatarUploaded:false,
    updated:false,
    formIsValid:false,
    valid:true,
    //profile:{'name':'', 'email':'', 'phone':'', 'avatar':''},
    nameRules: [
        v => !!v || 'Обов`язкове поле'
    ],
    emailRules: [
        v => /.+@.+/.test(v) || 'Невірний e-mail',
    ]
  }),
  mounted(){
    if(typeof(this.$route.params.signedup) != 'undefined'){
      this.signedup = this.$route.params.signedup;
    }
  },
  methods:{
    validateForm(){
      if (this.$refs.form.validate()) {
        this.formIsValid = true;
      } else{
         this.formIsValid = false;
      }
    },
    uploadAvatar(file){
      let store = this.$store;
      let firebase = this.$firebase;
      let ref = this;
      firebase.storage().ref().child('avatars/'+this.$firebase.auth().currentUser.uid).put(file).then(function(snapshot) {
          console.log('Uploaded a blob or file!'+snapshot);
          //get url
          snapshot.ref.getDownloadURL().then(function(url) {
          store.state.db.collection('users').doc(firebase.auth().currentUser.uid).update({'avatar':url});
          var reader = new FileReader();
          reader.onload = function(e) {
            document.getElementById('profileAvatar').src = e.target.result;
            ref.avatarUploaded = true;
            setTimeout(
              function(){
                ref.avatarUploaded = false;
              },3000);
          }
          reader.readAsDataURL(file);
        });
      });
    },
    saveInfo(){
      if(this.formIsValid){
        this.$store.state.db.collection("users").doc(this.$firebase.auth().currentUser.uid).update({'name':document.getElementById('userName').value, 'email':document.getElementById('userEmail').value});
        this.updated=true;
        let redirect = this.$router;

        setTimeout(
          function(){
            //redirect to account
           redirect.push({path:'qr', name:'Qr'});
          }
          ,3000
        );
      } else {
         alert('Форма заповнена невірно!');
      }
    },
    signOut(){
      if(confirm('Ви дійсно хочете вийти з додатку?')){
        let ref = this;
        ref.$firebase.auth().signOut().then(
          ()=>{
            ref.$store.state.user = false;
            ref.$router.push({path:'signup', name:'Signup', params:{logout:1}});
          }
        );
      }
    }
  }
};
</script>
