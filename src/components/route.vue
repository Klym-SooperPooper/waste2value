/*eslint-disable */
<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
     
      <v-flex mb-4>
        <h1 class="headline" style="color:orange">
          Рух екомаршруту <br/><span style="color:grey">17 січня 2021 року</span>
        </h1>
         <img src="https://scontent.fhrk2-1.fna.fbcdn.net/v/t1.0-9/18921974_3204925423010708_4484672113659046011_n.png?_nc_cat=107&ccb=2&_nc_sid=09cbfe&_nc_ohc=462OX4Z_5uAAX8KR6CI&_nc_oc=AQlAn2Qw0lHNEMH3xs4kwc15_LEFwrfznrxDwUNBHLWud-kaKz6KCYv2x8jAoBJjqqM&_nc_ht=scontent.fhrk2-1.fna&oh=6001bceeb319c980f5a19f619a4ffda8&oe=602715C4" height="250" />
        <template>
          <v-subheader><strong>Київський район</strong></v-subheader>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Час
                  </th>
                  <th class="text-left">
                    Місце зупинки
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>11:00 - 11:10</td>
                  <td>411 батарея</td>
                </tr>
                <tr>
                  <td>11:20 - 11:35</td>
                  <td>Парковка Таврії В "Таїровська"</td>
                </tr>
                <tr>
                  <td>11:40 - 11:50</td>
                  <td>ТЦ "Панорама"</td>
                </tr>
                <tr>
                  <td>12:05 - 12:25</td>
                  <td>Парковка Таврії В "Вузівський"</td>
                </tr>
                <tr>
                  <td>12:35 - 12:50</td>
                  <td>ЖК "Райдужний" біля універсаму "Копійка" на Небесної сотні, 65а</td>
                </tr>
                <tr>
                  <td>13:05 - 13:15</td>
                  <td>Таврія "Успех"</td>
                </tr>
                <tr>
                  <td>13:25 - 13:35</td>
                  <td>ЖК "Одіссей" (Альтаїр)</td>
                </tr>
                <tr>
                  <td>13:45 - 14:05</td>
                  <td>парк Горького (зі сторони вул. Варненської)</td>
                </tr>
                <tr>
                  <td>14:15 - 14:25</td>
                  <td>площа Б. Деревянка (Будинок меблів) парковка "Копійка"</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

           <v-subheader><strong>Суворовський район</strong></v-subheader>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Час
                  </th>
                  <th class="text-left">
                    Місце зупинки
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>11:00 - 11:10</td>
                  <td>Пересип (кінцева 191)</td>
                </tr>
                <tr>
                  <td>11:30 - 11:40</td>
                  <td>Metro</td>
                </tr>
                <tr>
                  <td>11:55 - 12:05</td>
                  <td>Кінотеатр "Зоряний"</td>
                </tr>
                <tr>
                  <td>12:15 - 12:25</td>
                  <td>ТРЦ "Сім`я"</td>
                </tr>
                <tr>
                  <td>12:35 - 12:45</td>
                  <td>ТРЦ City Center Котовського</td>
                </tr>
                <tr>
                  <td>12:55 - 13:05</td>
                  <td>Копійка на Паустовського</td>
                </tr>
                <tr>
                  <td>13:25 - 13:55</td>
                  <td>ТРЦ Рів`єра</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>

        <v-alert>
          Подробиці <a style="color:green" href="https://www.facebook.com/events/134313021833024/" target="_blank">на сторінці FB "Місто майбутнього"</a>
        </v-alert>

        <!--
        <v-text-field height="15" outlined id="adLocation" label="Змінити локацію" append-outer-icon="mdi-map-marker"></v-text-field>
        <v-card id="map" class="mb-12" height="300px"></v-card>
        -->
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
            zoom: 12,
            center: {lat: 50.95854, lng: 28.6335683}
          }
        );
        var marker = new google.maps.Marker({position: {lat: 50.95854, lng: 28.6335683}, map: map, icon:'https://firebasestorage.googleapis.com/v0/b/beeco-b0ed5.appspot.com/o/smartbin32.png?alt=media&token=fe05f116-4e57-40ba-9049-9653e3db6ce7'});
        var infowindow = new google.maps.InfoWindow({
          content:'Залізничний вокзал Коростень'
        });
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.open(map,marker);
        });
        var marker2 = new google.maps.Marker({position: {lat: 50.95116, lng: 28.6336863}, map: map, icon:'https://firebasestorage.googleapis.com/v0/b/beeco-b0ed5.appspot.com/o/smartbin32.png?alt=media&token=fe05f116-4e57-40ba-9049-9653e3db6ce7'});
        var infowindow2 = new google.maps.InfoWindow({
          content:'Базарна площа'
        });
        google.maps.event.addListener(marker2, 'click', function(){
          infowindow2.open(map,marker2);
        });

      });
      document.getElementById('map').style.height = (document.getElementsByClassName('v-content')[0].offsetHeight-145)+'px';
    }
  }
};
</script>
