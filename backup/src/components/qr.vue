/* eslint-disable */
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
          <qrcode-stream @decode="onDecode" @init="onInit" height="100"></qrcode-stream>
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
    //var transfer = {fromid:1, tokens:1,  time:Date. now()};
    transaction = JSON.stringify(transaction);
    //eslint-disable-next-line no-console
    console.log(transaction);
    qr.addData(this.$encryptor.encrypt(JSON.stringify(transaction)));
    qr.make();
    document.getElementById('placeHolder').innerHTML = qr.createImgTag();*/
  },
  methods: {
      //camera QR init
      async onInit (promise) {
      // show loading indicator

      try {
        const { capabilities } = await promise
        alert(capabilities);
        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
        } else if (error.name === 'OverconstrainedError') {
          // did you requested the front camera although there is none?
        } else if (error.name === 'StreamApiNotSupportedError') {
          // browser seems to be lacking features
        }
        alert(error.name);
      } finally {
        // hide loading indicator
      }
    },
     IsJsonString(str) {
        try {
           //eslint-disable-next-line
            console.log('try str => '+str);
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
        let db = this.$store.state.db;
        let ref = this;
        //eslint-disable-next-line
        let getUserDocRef = db.collection('users').doc(this.$firebase.auth().currentUser.uid);

        if(typeof decodedString === 'object'){
          //lottery
          if(typeof decodedString.t !== 'undefined'){
             db.collection("qr")
            .where("t", "==", decodedString.t)
            .where("activated", "==", false)
            .get().then(
              function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  db.collection('qr').doc(doc.id).update({'uid':ref.$firebase.auth().currentUser.uid, 'activated':true})
                  .then(
                    ()=>{
                      alert('QR active user is updated!');
                      decodedString = {'binid':1, 'bonus':ref.$bonusRate, 'bonusRate':ref.$bonusRate, 'count':1, 'rate':ref.$rate, 'tokens':ref.$rate, 'uid':ref.$firebase.auth().currentUser.uid, 'time':Date.now().toString()};
                      db.collection("transactions").add(decodedString)
                      .then(function(docRef) {
                          //eslint-disable-next-line no-console
                          console.log("Transaction written with ID: ", docRef.id);
                          //run TRANSFER USER transaction
                          return db.runTransaction(function(transaction) {
                              // This code may get re-run multiple times if there are conflicts.
                              //eslint-disable-next-line
                              return transaction.get(getUserDocRef).then(function(getUserDoc) {
                                  if (!getUserDoc.exists) {
                                      throw "Document does not exist!";
                                  }
                                  var newTokens = getUserDoc.data().tokens + decodedString.tokens;
                                  var newBonus = getUserDoc.data().bonus + decodedString.bonus;
                                  //eslint-disable-next-line
                                  transaction.update(getUserDocRef, { tokens: newTokens, bonus: newBonus});
                                  console.log("user "+getUserDoc.id+" played lottery for the amount of "+newTokens+" tokens");
                              });
                          }).then(function() {
                              console.log("Lottery user transaction successfully committed!");
                              //run transaction for transfer user
                              //eslint-disable-next-line
                              router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens}});
                          }).catch(function(error) {
                              console.log("Transaction failed: ", error);
                          });
                      })
                      .catch(function(error) {
                        //eslint-disable-next-line no-console
                          console.error("Error adding document: ", error);
                      });
                    }
                  );
                });
            });
          }
          //transfer or vending machine generation
          //TRANSFER
          else if(typeof decodedString.tokens !== 'undefined'){
            //alert('Get your '+decodedString.tokens+' tokens from '+decodedString.fromid+' !');
            //add owner of transaction
            decodedString.uid = this.$firebase.auth().currentUser.uid;
            //eslint-disable-next-line
            let getTransferUserDocRef = db.collection('users').doc(decodedString.fromid.toString());
            //make sure we get a number of tokens
            decodedString.tokens = parseInt(decodedString.tokens);
            db.collection("transactions").add(decodedString)
            .then(function(docRef) {
               //eslint-disable-next-line no-console
                console.log("Transaction written with ID: ", docRef.id);
                
                //run OWNER USER transaction
                return db.runTransaction(function(transaction) {
                    // This code may get re-run multiple times if there are conflicts.
                    //eslint-disable-next-line
                    return transaction.get(getUserDocRef).then(function(getUserDoc) {
                        if (!getUserDoc.exists) {
                            throw "Document does not exist!";
                        }
                        var newTokens = getUserDoc.data().tokens + decodedString.tokens;
                        //eslint-disable-next-line
                        transaction.update(getUserDocRef, { tokens: newTokens });
                        console.log("user "+getUserDoc.id+" got "+newTokens+" tokens");
                    });
                }).then(function() {
                    console.log("Get user transaction successfully committed!");
                     //run TRANSFER USER transaction
                    return db.runTransaction(function(transaction) {
                        // This code may get re-run multiple times if there are conflicts.
                        //eslint-disable-next-line
                        return transaction.get(getTransferUserDocRef).then(function(getTransferUserDoc) {
                            if (!getTransferUserDoc.exists) {
                                throw "Document does not exist!";
                            }
                            var newTokens = getTransferUserDoc.data().tokens - decodedString.tokens;
                            //eslint-disable-next-line
                            transaction.update(getTransferUserDocRef, { tokens: newTokens });
                            console.log("user "+getTransferUserDoc.id+" transferred "+newTokens+" tokens");
                        });
                    }).then(function() {
                        console.log("Transfer user transaction successfully committed!");
                        //run transaction for transfer user
                        router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens}});
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
           //RECYCLE transaction 
          } else if(typeof decodedString.count !=='undefined'){
            //let recycleTime = new Date(decodedString.time);
            // alert('Thanks for '+decodedString.count+' '+recycleTime.getDate()+' '+(recycleTime.getMonth()+1)+' '+recycleTime.getFullYear());
            //eslint-disable-next-line
            let getUserDocRef = db.collection('users').doc(this.$firebase.auth().currentUser.uid);
            //add owner of transaction
            decodedString.uid = this.$firebase.auth().currentUser.uid;
            //calc rates
            decodedString.tokens = this.$rate*decodedString.count;
            decodedString.rate = this.$rate;
            //calc bonuses
            decodedString.bonus = this.$bonusRate*decodedString.count;
            decodedString.bonusRate = this.$bonusRate;
            db.collection("transactions").add(decodedString)
            .then(function(docRef) {
               //eslint-disable-next-line no-console
                console.log("Transaction written with ID: ", docRef.id);
                      //run TRANSFER USER transaction
                return db.runTransaction(function(transaction) {
                    // This code may get re-run multiple times if there are conflicts.
                    //eslint-disable-next-line
                    return transaction.get(getUserDocRef).then(function(getUserDoc) {
                        if (!getUserDoc.exists) {
                            throw "Document does not exist!";
                        }
                        var newTokens = getUserDoc.data().tokens + decodedString.tokens;
                        var newBonus = getUserDoc.data().bonus + decodedString.bonus;
                        //eslint-disable-next-line
                        transaction.update(getUserDocRef, { tokens: newTokens, bonus: newBonus});
                        console.log("user "+getUserDoc.id+" recycled for the amount of "+newTokens+" tokens");
                    });
                }).then(function() {
                    console.log("Recycling user transaction successfully committed!");
                    //run transaction for transfer user
                    //eslint-disable-next-line
                    router.push({path:'wallet', name:'Wallet', params:{'transferred':decodedString.tokens}});
                }).catch(function(error) {
                    console.log("Transaction failed: ", error);
                });
            })
            .catch(function(error) {
              //eslint-disable-next-line no-console
                console.error("Error adding document: ", error);
            });
          } else if(typeof decodedString.active !=='undefined'){
            alert(decodedString);
            db.collection('bin_users')
            .where('datetime','==',decodedString.datetime)
            .where('pending','==',true)
            .where('binid','==',decodedString.binid)
            .get().then(function(querySnapshot) {
              if(querySnapshot.exists){
                querySnapshot.forEach(function(doc) {
                  db.collection('bin_users').doc(doc.id).update({'pending':false, 'active':true,'uid':ref.$firebase.auth().currentUser.uid});
                  alert('active user is updated!');
                });
              } else {
                alert("Error getting active doc");
              }
            }).catch(function(error) {
                alert(error);
                console.log("Error getting active => ", error);
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
