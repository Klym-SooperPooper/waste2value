<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
        <v-flex xs12>
        <h1 class="headline" style="color:orange">
            Дошка оголошень
         </h1>
         <v-btn color="green" dark @click.stop="addPostDialog = true">
          Додати
          <v-icon right>mdi-plus</v-icon>
        </v-btn> 
        <br/>
        <v-dialog v-model="addPostDialog" max-width="290">
          <v-card>
            <v-card-title>Додати оголошення</v-card-title>
              <v-card-text>
              <img src="" v-if="uploadedFile" width="225" id="previewImage" /> 
              <v-form ref="form" id="adForm" v-model="valid" lazy-validation>
                  <v-btn color="success" id="invokeUpload" class="mr-4" @click="invokeUpload" outlined="">Завантажити файл</v-btn>
                  <v-file-input height="15" outlined id="imageUpload" label="Завантажити фото" @change="previewPhoto($event)"></v-file-input>
                  <v-text-field height="15" outlined id="adTitle" label="Назва оголошення" :rules="adRules" @change="validateForm" required></v-text-field>
                  <v-textarea outlined id="adText" label="Додати опис" :rules="adRules" @change="validateForm" required></v-textarea>
                  <v-text-field height="15" outlined id="adPrice" label="Вказати ціну" :rules="adRules" @change="validateForm" required></v-text-field>
                  <div class="text-center" v-if="updated">
                    <v-alert color="green lighten-2" height="40" style="padding-top:7px">Оголошення додано!</v-alert>
                  </div>
                  <v-btn id="submitForm"
                    :disabled="!formIsValid"
                    color="success"
                    class="mr-4"
                    @click="postAd"
                    centered
                  >
                    Опублікувати
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <br/>
          <!--
            <v-sheet class="text-left">Сортувати за ціною</v-sheet>
            
            <v-range-slider
            v-model="range"
            :max="max"
            :min="min"
            hide-details
            class="align-center"
            color="orange"
            track-color="grey"
          >
            <template v-slot:prepend>
              <v-text-field
                v-model="range[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                v-model="range[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
              ></v-text-field>
            </template>
          </v-range-slider>
        -->

          <v-card v-for="ad in ads" :key="ad.id" class="mx-auto adDiv" outlined>
            <v-btn v-if="ad.uid==$firebase.auth().currentUser.uid" @click="deleteAd(ad.id)"><v-icon>mdi-close</v-icon></v-btn>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1 text-left">{{ad.title}}</v-list-item-title>
                <v-list-item-subtitle class="text-left">{{ad.text}}</v-list-item-subtitle>
              </v-list-item-content>
              <img v-bind:src="ad.image" width="50"/>
            </v-list-item>
             <v-layout justify-end>
              <v-chip text-color="#07C01A" color="transparent">
                <v-icon color="#07C01A" small>mdi-coin-outline</v-icon>
                  {{ad.price}}
              </v-chip>
              <v-btn color="orange" text @click="comingSoon">Аукціон</v-btn>
              <v-btn color="orange" dark @click="callUser(ad.uid)">Купити</v-btn>
            </v-layout>
          </v-card>
          
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'foo',
  data: () => ({
    uploadedFile:false,
    updated:false,
    deleteID:'6V2sJCPYPM8TOQ8CL35C',
    ads:'',
    min: 0,
        max: 1000,
        slider: 400,
        range: [100, 500],
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    addPostDialog:false,
    formIsValid:false,
    valid:true,
    adRules: [
        v => !!v || 'Обов`язкове поле'
    ]
  }),
  async mounted(){
    await this.$store.state.db.collection('classifieds').orderBy('created','desc').onSnapshot(
      (querySnapshot)=>{
         this.ads = querySnapshot.docs.map(doc => ({
                  'id': doc.id,
                  'image': doc.data().image,
                  'text':doc.data().text,
                  'title':doc.data().title,
                  'price':doc.data().price,
                  'uid':doc.data().uid
                })
          );
        }
      );
  },
   methods:{
    callUser(uid){
      console.log(this.$store.state.db.collection('users'));
      this.$store.state.db.collection('users').doc(uid).get().then(
        (doc)=>{
          if(confirm('Подзвонити продавцю на '+doc.data().phone+' ?')){
            window.location.href="tel://"+doc.data().phone;
          }
        }
      );
    }, 
    validateForm(){
      if (this.$refs.form.validate()) {
        this.formIsValid = true;
      } else{
         this.formIsValid = false;
      }
    },
    invokeUpload(){
      document.getElementById('imageUpload').click();
    },
    comingSoon(){
      alert('незабаром');
    },
    previewPhoto(input) {
        var reader = new FileReader();
        this.uploadedFile = input;
        reader.onload = function(e) {
          document.getElementById('previewImage').src = e.target.result;
        }
        reader.readAsDataURL(input);
    },
    deleteAd(adKey){
      if(confirm('Видалити оголошення?')){
        this.$store.state.db.collection('classifieds').doc(adKey).delete().then(
          function(){
            console.log('deleted ad => '.adKey);
          }
        )
      }
    },
    postAd(){
      let store = this.$store;
      let firebase = this.$firebase;
      let uploadedFile = this.uploadedFile;
      let ref = this;

      this.$store.state.db.collection('classifieds').add({'uid':this.$firebase.auth().currentUser.uid, 'created':Date. now(), 'price':document.getElementById('adPrice').value, 'title':document.getElementById('adTitle').value, 'text':document.getElementById('adText').value}).then(
        (ad)=>{
          console.log("Document written with ID: ", ad.id);
          document.getElementById('adPrice').value='';document.getElementById('adText').value='';document.getElementById('adTitle').value='';
          ref.updated = true;
          
          if(this.uploadedFile){
            //add image and update
            firebase.storage().ref().child('classifieds/'+ad.id).put(uploadedFile).then(function(snapshot) {
              console.log('Uploaded a blob or file!'+snapshot);
              //get url
              snapshot.ref.getDownloadURL().then(function(url) {
                store.state.db.collection('classifieds').doc(ad.id).update({'image':url});
                console.log('Uploaded image!'+url);
                ref.uploadedFile = false;
                document.getElementById('previewImage').src = '';
                document.getElementById('imageUpload').value='';
                setTimeout(function(){ref.addPostDialog = false;  ref.updated = false;}, 2000);
              });
            });
          } else {
            setTimeout(function(){ref.addPostDialog = false; ref.updated = false;}, 2000);
          }
        }
      );
    }
   }
};
</script>
