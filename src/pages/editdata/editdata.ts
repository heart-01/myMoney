import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

/**
 * Generated class for the EditdataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editdata',
  templateUrl: 'editdata.html',
})
export class EditdataPage {

  data={ rowid:0, date:"", type:"", description:"", amount:0 }; //สร้างตัวแปรเพื่อรับค่าจาก Form

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private toast: Toast) {

    this.getCurrentData(navParams.get('rowid')); //รับข้อมูล rowid แล้วส่งให้กับ method getCurrentData
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditdataPage');
  }

  //method แสดงข้อมูล rowid ที่ได้รับมา
  getCurrentData(rowid){
    this.sqlite.create({ name: "ionicdb.db",
     location: "default" 
    })
      .then((db:SQLiteObject)=>{
        db.executeSql("SELECT * from expense WHERE rowid=?",[rowid])
          .then(
            res=>{  //res เก็บค่าที่ได้หลังจาก executeSql
              if(res.rows.length>0){ //เช็คข้อมูล res ถ้า มีมากกว่า 0 ให้ทำงานใน Statement 
                this.data.rowid=res.rows.item(0).rowid; //ดึงข้อมูล rowid จาก res แถวที่ 0 มาใส่ตัวแปร array data ตำแหน่งที่ 0 ตัวแปร rowid ทำแบบนี้เพื่อไม่ให้ตัวแปร array data มีค่าว่าง เวลา update ที่ไม่ได้กรอกข้อมูลจะได้ใช้ข้อมูลเดิม
                this.data.date=res.rows.item(0).date; 
                this.data.type=res.rows.item(0).type;
                this.data.description=res.rows.item(0).description;
                this.data.amount=res.rows.item(0).amount;
              }
            }
          )
          .catch(e=>{
            console.log(e);
            this.toast.show(e,'3000','center')
              .subscribe(
                toast=>{
                  console.log(toast);
                }
              );

          });
      })
      .catch(e=>{
        console.log(e);
        this.toast.show(e,'3000','center')
          .subscribe(
            toast=>{
              console.log(toast);
            }
          );

      });
  }

  //method update data
  updateData(){
    this.sqlite.create({ name: "ionicdb.db",
     location:"default"})
      .then(
        (db:SQLiteObject)=>{
          db.executeSql("UPDATE expense SET date=?, type=?, description=?, amount=? WHERE rowid=?",
            [
              this.data.date,
              this.data.type,
              this.data.description,
              this.data.amount,
              this.data.rowid
            ])
            .then(res=>{
              console.log(res);
              this.toast.show('Data updated','3000','center')
              .subscribe(
                toast=>{
                  console.log(toast);
                  this.navCtrl.popToRoot(); //ใช้แสดงหน้าแรก popToRoot หน้าที่เซ็ตเอาไว้เป็น root page
                }
              );
            })
            .catch(e=>{
              console.log(e);
              this.toast.show(e,'3000','center')
                .subscribe(
                  toast=>{
                    console.log(toast);
                  }
                );  
            });

        }
      )
      .catch(e=>{
        console.log(e);
        this.toast.show(e,'3000','center')
          .subscribe(
            toast=>{
              console.log(toast);
            }
          );
      });
  }
}