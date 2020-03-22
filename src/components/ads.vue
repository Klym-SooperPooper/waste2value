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
         <v-btn color="green" dark @click.stop="addPost">
          Додати
          <v-icon right>mdi-plus</v-icon>
        </v-btn> 
          
        <br/>
        <v-dialog v-model="connectDialog" max-width="300">
          <v-card>
                 <v-card-title>Зв`язатись з продавцем</v-card-title>
                 <v-card-text class="text-center">
                  <v-btn dark color="green" @click="callUser"><v-icon>mdi-phone</v-icon>Зателефонувати?</v-btn>
                  <br/>
                  <v-btn>Лишити свій контакт</v-btn>
                 </v-card-text>
          </v-card> 
        </v-dialog> 

        <v-dialog v-model="auctionDialog" max-width="300">
          <v-card>
                 <v-card-title justify="center">Запропонувати ціну</v-card-title>
                 <v-card-text class="text-center">
                   <v-text-field height="15" outlined id="adAuctionPrice" @change="validateForm" append-outer-icon="mdi-currency-usd-circle-outline"></v-text-field>
                  <v-btn dark color="orange">Зробити ставку</v-btn>
                 </v-card-text>
          </v-card> 
        </v-dialog> 

         <v-dialog v-model="responseDialog" max-width="320">
          <v-card>
                 <v-card-title justify="center">Зацікавлені покупці</v-card-title>
                 <v-card-text class="text-center">
                   <template>
                      <v-simple-table dense>
                        <template v-slot:default>
                            <tbody>
                              <tr>
                                <td class="text-left">1</td>
                                <td class="text-left">Vasiliy</td>
                                <td class="text-left">
                                  <v-chip color="transparent">
                                    <v-icon color="#07C01A" small>mdi-currency-usd-circle-outline</v-icon>900
                                  </v-chip>
                                </td>
                                <td><v-btn text small color="green"><v-icon>mdi-phone</v-icon></v-btn></td>
                              </tr>
                              <tr>
                                <td class="text-left">2</td>
                                <td class="text-left">Alex</td>
                                <td class="text-left">
                                  <v-chip color="transparent">
                                    <v-icon color="#07C01A" small>mdi-currency-usd-circle-outline</v-icon>800
                                  </v-chip>
                                </td>
                                <td><v-btn text small color="green"><v-icon>mdi-phone</v-icon></v-btn></td>
                              </tr>
                              <tr>
                                <td class="text-left">3</td>
                                <td class="text-left">Sergey</td>
                                <td class="text-left">
                                  <v-chip color="transparent">
                                    <v-icon color="#07C01A" small>mdi-currency-usd-circle-outline</v-icon>650
                                  </v-chip>
                                </td>
                                <td><v-btn text small color="green"><v-icon>mdi-phone</v-icon></v-btn></td>
                              </tr>
                            </tbody>
                        </template>
                      </v-simple-table>
                   </template>
                 </v-card-text>
          </v-card> 
        </v-dialog> 

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
                  <v-text-field height="15" outlined id="adLocation" @change="validateForm" append-outer-icon="mdi-map-marker"></v-text-field>
                                    
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
          <v-card class="mx-auto adDiv" v-for="ad in ads" :key="ad.id" :class="{ highlighted: ad.uid === $firebase.auth().currentUser.uid}" max-width="400">
          <v-img v-if="ad.image" class="white--text align-end" height="200px" v-bind:src="ad.image">
            <v-card-title><span>{{ad.title}}</span></v-card-title>
          </v-img>
          <v-img v-else class="white--text align-end" height="200px" src="https://firebasestorage.googleapis.com/v0/b/beeco-b0ed5.appspot.com/o/beeco-add-default.png?alt=media&amp;token=df84a672-29af-443c-8727-0dd4e66736c0">  
            <v-card-title><span>{{ad.title}}</span></v-card-title>
          </v-img>
          <v-card-text class="text--primary">
            <div>{{ad.text}}</div>
          </v-card-text>
          <v-chip color="transparent">
            <v-icon color="#07C01A" small>mdi-currency-usd-circle-outline</v-icon>
            {{ad.price}}
          </v-chip>
          <br/>
          <v-chip color="transparent">
            <v-icon color="grey" small>mdi-map-marker</v-icon>
            Коростень, Житомирська область
          </v-chip>
          <v-card-actions>
            <!-- public buttons-->
            <v-row v-if="ad.uid!=$firebase.auth().currentUser.uid" justify="center" align="center">
              <v-btn outlined color="orange" text @click="auctionAd(ad.uid)">Аукціон</v-btn>
              <v-btn color="orange" dark @click="contactUser(ad.uid)">Купити</v-btn>
              <v-btn outlined="" color="green" @click="contactUser(ad.uid)"><v-icon>mdi-truck-delivery-outline</v-icon>Вивезти</v-btn>
            </v-row>
            <!-- USER buttons-->
            <v-row v-else justify="center" align="center">
              <v-btn depressed outlined color="orange" text @click="responseUser(ad.id)">
                Аукціон<v-chip color="green" text-color="white" small>2</v-chip>
              </v-btn>
             <v-btn color="orange" dark @click="responseUser(ad.id)"><v-icon>mdi-account</v-icon><v-chip dark color="white" text-color="black" small>1</v-chip></v-btn>
             <v-btn outlined="" color="green" @click="responseUser(ad.id)"><v-icon>mdi-truck-delivery-outline</v-icon><v-chip dark color="white" text-color="green" small>1</v-chip></v-btn>
             <v-btn text color="orange" @click="deleteAd(ad.id)"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
           </v-row> 
          </v-card-actions>
        </v-card>
          <!--
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
                <v-icon color="#07C01A" small>mdi-currency-usd-circle-outline</v-icon>
                  {{ad.price}}
              </v-chip>
              <v-btn color="orange" text @click="comingSoon">Аукціон</v-btn>
              <v-btn color="orange" dark @click="contactUser(ad.uid)">Купити</v-btn>
            </v-layout>
          </v-card>
          -->
          
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
    autocomplete:'',
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
    connectDialog:false,
    responseDialog:false,
    auctionDialog:false,
    valid:true,
    userPhone:'',
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
    addPost:function(){
      this.addPostDialog = true;
      this.initAutocomplete();
    }, 
    initAutocomplete: function(){
       let ref = this;
       ref.$GoogleMapsLoader.load(function(google, ref) {
         var input = document.getElementById('adLocation');
         ref.autocomplete = new google.maps.places.Autocomplete(input);
       });
    }, 
    callUser(){
      if(confirm('Подзвонити продавцю на '+this.userPhone+' ?')){
        window.location.href="tel://"+this.userPhone;
      }
    },
    contactUser(uid){
      let ref = this;
      ref.connectDialog = true;
      ref.$store.state.db.collection('users').doc(uid).get().then(
        (doc)=>{
          ref.userPhone = doc.data().phone; 
          /*if(confirm('Подзвонити продавцю на '+doc.data().phone+' ?')){
            window.location.href="tel://"+doc.data().phone;
          }*/
        }
      );
    }, 
    responseUser(uid){
      console.log(uid);
      this.responseDialog=true;
    },
    auctionAd(uid){
      console.log(uid);
      this.auctionDialog=true;
    },
    getAddressData: function (addressData, placeResultData, id) {
        alert(addressData+placeResultData+id);
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
