<template>
  <v-container>
  </v-container>
</template>

<script>
export default {
  name: 'Api',
  data: () => ({
  }),
  mounted(){
    let db = this.$store.state.db;
    let saveWallet = {};
    saveWallet.binid = this.$route.query.binid;
    saveWallet.count = this.$route.query.count;
    if(this.$transactionKey==this.$route.query.key){
      let ref = this;
      if(this.$route.query.count){
        let getUserDocRef = db.collection('users').doc(this.$firebase.auth().currentUser.uid);
        
        db.collection('bin_users').where('binid','==',parseInt(this.$route.query.binid))
        .where('active','==',true)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                saveWallet.uid = doc.data().uid;
                saveWallet.rate = ref.$rate;
                saveWallet.tokens = ref.$rate;
                saveWallet.time = Date. now();
                db.collection("transactions").add(saveWallet)
                .then(
                  (savedTransactionID)=>{
                    console.log('savedTransactionID => '+savedTransactionID.id);
                    return db.runTransaction(function(transaction) {
                      // This code may get re-run multiple times if there are conflicts.
                      //eslint-disable-next-line
                      return transaction.get(getUserDocRef).then(function(getUserDoc) {
                          if (!getUserDoc.exists) {
                              throw "Document does not exist!";
                          }
                          var newTokens = getUserDoc.data().tokens + saveWallet.tokens;
                          //var newBonus = getUserDoc.data().bonus + decodedString.bonus;
                          //eslint-disable-next-line
                          transaction.update(getUserDocRef, { tokens: newTokens/*, bonus: newBonus*/});
                          ref.$store.state.user.tokens = newTokens;
                          alert("user "+getUserDoc.id+" recycled for the amount of "+newTokens+" tokens");
                      });
                    }).then(function() {});
                  }
                );
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
      }

      if(this.$route.query.active){
        let activeUser = {};
      // activeUser.uid = this.$firebase.auth().currentUser.uid;
        activeUser.binid = this.$route.query.binid;
        activeUser.active = true;
        activeUser.pending = true;
        activeUser.datetime = Date.now();

        //delete active 
        var activekill_query = db.collection('bin_users').where('active','==',true);
        activekill_query.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
            alert(doc.id);
          });
        }).then(
          ()=>{
            db.collection('bin_users').add(activeUser)
          }
        );
      }
    } else {
      console.log('invalid key');
    }
  },
  methods:{
  }
};
</script>
