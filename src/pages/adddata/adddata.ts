import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SQLite,SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

/**
 * Generated class for the AdddataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adddata',
  templateUrl: 'adddata.html',
})
export class AdddataPage {

  data = { date:"", type:"", description:"", amount:0 };

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite : SQLite, public toast : Toast) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdddataPage');
  }

  saveData(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    })
      .then(
        (db:SQLiteObject)=>{
          db.executeSql("INSERT INTO expense VALUES (NULL,?,?,?,?)",
          [
            this.data.date,
            this.data.type,
            this.data.description,
            this.data.amount
          ]) // ? เป็นการ binding ของ SQLite  จะดึงข้อมูลของ array ใน [] ไล่เรียงมา
          .then(
            res=>{ // res เก็บค่าที่ได้หลังจาก executeSql อาจเป็น true หรือ false
              console.log(res); // แสดง res ที่เป็นการคืนค่า หลังจาก executeSql
              this.toast.show('Data Saved','3000','center') //แสดง Data Saved popup toast 3 วินาที
                .subscribe(toast=>{ //subscribe คือ หลังจากแสดงผล toast แล้วให้ทำอะไรต่อ
                  console.log(toast); //แสดงข้อมูล toast
                  this.navCtrl.popToRoot(); //ใช้แสดงหน้าแรก popToRoot หน้าที่เซ็ตเอาไว้เป็น root page
                });
            }
          )
          .catch(e=>{  //หลังเกิด Error แล้วให้แสดง popup แบบ toast
            console.log(e);
            this.toast.show(e.message,'3000','center') //แสดง e คือ แสดง error ว่าเกิดอะไร popup toast 3 วินาที
            .subscribe(toast=>{ //subscribe คือ หลังจากแสดงผล toast แล้วให้ทำอะไรต่อ
              console.log(toast); //แสดงข้อมูล toast
            })
          });
        }
      ).catch(e=>{
        console.log(e);
        this.toast.show(e.message,'3000','center') //แสดง e คือ แสดง error ว่าเกิดอะไร popup toast 3 วินาที
        .subscribe(toast=>{ //subscribe คือ หลังจากแสดงผล toast แล้วให้ทำอะไรต่อ
          console.log(toast); //แสดงข้อมูล toast
        })
      });
  }

}
