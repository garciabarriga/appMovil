import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

declare var google;


@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {

  mision: any = {}
  lat;
  long;
  distancia: any
  altura:any="Calculando..."
  elevator:any
  altObj:any={}
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {

    this.mision = this.navParams.get('mision');
    this.elevator = new google.maps.ElevationService;

  }

  ionViewDidLoad() {
    this.getPosition()
  
  }

  getPosition(): any {
    this.geolocation.getCurrentPosition()
      .then(response => {

        this.lat = response.coords.latitude
        this.long = response.coords.longitude
        this.altura = response.coords.altitude

        var la1 = -0.315885
        var lo1 = -78.4427159
        this.distancia = this.getKilometros(la1, lo1, this.lat, this.long)
        this.lat = this.lat.toFixed(3)
        this.long = this.long.toFixed(3)
        var locations = new google.maps.LatLng(this.lat, this.long)

        this.elevator.getElevationForLocations({'locations': [locations]}, (results, status)=>{
          if (status === 'OK') {
            if (results[0]) {
              console.log(results[0])
              this.altura = (results[0].elevation)
              this.altura = this.altura.toFixed(3)

            } else {
              console.log('No results found');
            }
          } else {
            console.log('Elevation service failed due to: ' + status);
          }
        }
      
      
      );
        /*  setTimeout(() => {    //<<<---    using ()=> syntax
            this.displayLocationElevation(position, elevator)
          }, 3000);
  
  */

      })
      .catch(error => {
        console.log(error);
      })
  }



  getKilometros = function (lat1, lon1, lat2, lon2) {
    var rad = function (x) { return x * Math.PI / 180; }
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
  }

}
