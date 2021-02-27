/*eslint-disable */
<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
     
      <v-flex mb-4>
        <v-text-field height="15" outlined id="adLocation" label="Змінити локацію" append-outer-icon="mdi-map-marker"></v-text-field>
        <v-card id="map" class="mb-12" height="300px"></v-card>
        <!--
        <v-card id="map" color="#ebfbed" class="mb-12" height="300px">
           <v-icon x-large color="green" style="margin-top:140px">mdi-delete</v-icon>
        </v-card>
        <v-banner sticky color="#07C01A">
          <v-icon>mdi-coin-outline</v-icon>
          Очищуй довкілля та заробляй 10 токенів за кожне фото або 100 за кожну відсортовану пляшку
        </v-banner>
        -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'foo',

  data: () => ({
    map:'',
    bounds:'',
    qr:''
  }),
  mounted(){
    this.initMap();

  },
  methods:{
    initMap: function(){
       this.$GoogleMapsLoader.load(function(google) {
        var map = new google.maps.Map(document.getElementById('map'),
          {
            zoom: 10,
            center: {lat: 46.48543660778156, lng: 30.737911488867965}
          }
        );
        var marker = new google.maps.Marker({position: {lat: 46.48543660778156, lng: 30.737911488867965}, map: map, icon:'https://firebasestorage.googleapis.com/v0/b/beeco-b0ed5.appspot.com/o/smartbin32.png?alt=media&token=fe05f116-4e57-40ba-9049-9653e3db6ce7'});
        var infowindow = new google.maps.InfoWindow({
          content:'Пункт прийому Місто Майбутнього'
        });
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.open(map,marker);
        });
        /*var marker2 = new google.maps.Marker({position: {lat: 50.95116, lng: 28.6336863}, map: map, icon:'https://firebasestorage.googleapis.com/v0/b/beeco-b0ed5.appspot.com/o/smartbin32.png?alt=media&token=fe05f116-4e57-40ba-9049-9653e3db6ce7'});
        var infowindow2 = new google.maps.InfoWindow({
          content:'Базарна площа'
        });
        google.maps.event.addListener(marker2, 'click', function(){
          infowindow2.open(map,marker2);
        });*/

      });
      document.getElementById('map').style.height = (document.getElementsByClassName('v-content')[0].offsetHeight-145)+'px';
    }
  }
};
</script>
