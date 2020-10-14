<template>
  <v-container style="height:500px">
    <v-layout
      text-center
      wrap
    >
      <v-flex>
        <h1 class="headline" style="color:orange">
          Генератор QR
        </h1>
        <v-btn v-if="!imgGen" dark color="green" @click="qrGenerate()">Згенерувати</v-btn>
        <v-btn v-if="imgGen" dark color="orange" style="margin-left:10px" @click="printQr()">Роздрукувати</v-btn>
        <table id="qrHolderGen"></table>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
   name: 'Qrarray',
   data: () => ({
     r:10,
     c:10,
     imgGen:false
   }),
   created(){
    //let ref = this;
    //let db = this.$store.state.db;
   },
   methods: {
     qrGenerate(){
       let tr=''; let ref = this;
       let qr = '';  let db = ref.$store.state.db;
        for(let i=0; i<this.r; i++){
          for(let y=0; y<this.c; y++){
            setTimeout(
              function(){
                if(y == 0){
                  tr = document.createElement("tr");   
                  tr = document.getElementById("qrHolderGen").appendChild(tr);
                }
                qr = ref.$qrcode(0, 'L');
                var td = document.createElement("td");                 
                tr.appendChild(td);
                let qrDate = {t:Date.now().toString(), activated:false};
                qr.addData(JSON.stringify(qrDate));
                qr.make();
                td.innerHTML = qr.createImgTag(4,10);
                db.collection('qr').add(qrDate);
                if(y == (ref.c-1) && i == (ref.r-1)){
                  ref.imgGen= true;
                } 
              }, 1000
            )
          }
        } 
     },
     printQr(){
      let ref = this; 
      const prtHtml = document.getElementById('qrHolderGen').innerHTML;
      // Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      WinPrint.document.write('<html><body>'+prtHtml+'</body></html>');
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      ref.imgGen = false;
      document.getElementById('qrHolderGen').innerHTML = '';
     }
   }
  }
</script>
