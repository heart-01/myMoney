import { EditdataPage } from './../editdata/editdata';
import { AdddataPage } from './../adddata/adddata';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //ประกาศตัวแปรก่อนไว้สำหรับจัดเก็บข้อมูลรายรับรายจ่ายยอดคงเหลือ
  expenses:any=[];
  totalIncome=0;
  totalExpense=0;
  balance=0;

  constructor(public navCtrl: NavController, public sqlite : SQLite) {
  }

  ionBiewDidLoad(){
    this.getData();
  }

  ionBiewWillEnter(){
    this.getData();
  }

  //method getdata จะเป็น method สำหรับสร้างตารางถ้าไม่มีจะสร้างตารางให้ก่อน
  getData(){
    this.sqlite.create({  //สร้างฐานข้อมูล
      name:'ionicdb.db', //ชื่อฐานข้อมูล
      location:'default' //ตำแหน่งที่เก็บในเครื่องให้เป็น default
    }).then( //เมื่อสร้างแล้วให้ทำงานหลัง then
      (db: SQLiteObject)=>{ //สร้าง method db แล้วทำงาน
        db.executeSql('CREATE TABLE IF NOT EXISTS expense (rowid INTEGER PRIMARY KEY, date TEXT, type TEXT, description TEXT, amount INTEGER)') //คำสั่ง SQL จะเช็คว่ามีตารางในฐานข้อมูลแล้วรึยังถ้าไม่มีจะสร้างขึ้นมา
          .then(res=>console.log('Executed SQL')) //เมื่อ executeSql สำเร็จแล้วให้ทำงานต่อ แสดง Executed SQL
          .catch(e=>console.log(e)); //แต่เมื่อ SQL เกิด Error ให้ตกมาอยู่ที่ catch แล้วให้  console แสดงผลแล้วจะได้รู้ว่าเกิดจากอะไร
          db.executeSql('SELECT * FROM expense ORDER BY rowid DESC')
            .then(res=>{ //เมื่อเสร็จแล้วให้ทำงานหลัง then res กำหนดตัวแปรเพื่อมาส่งค่า
              this.expenses=[]; //นำข้อมูลที่ได้จากการ executeSql มาอยู่ในตัวแปร expenses ที่เป็น array
              for(var i=0;i<res.rows.length;i++){  //อ่านค่าทุกแถวแล้วมาใส่ในตัวแปร expenses ที่เป็น array ที่ละแถว
                this.expenses.push({ //push เป็นการนำข้อมูลใส่ในตัวแปร expenses
                  rowid: res.row.item(i).rowid, //สร้าง ตัวแปร rowid แล้วเก็บค่าของแถว rowid
                  date: res.rows.item(i).date,
                  type: res.rows.item(i).type,
                  description: res.rows.item(i).description,
                  amount: res.rows.item(i).amount
                })
              }
            }) 
            .catch(e=>console.log(e));
          
          //หารายรับรวม
          db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"')
          .then(res=>{
            if(res.rows.length>0){
              this.totalIncome=parseInt(res.row.item(0).totalIncome);
              this.balance=this.totalIncome-this.totalExpense;
            }
          })
          .catch(e=>console.log(e));

          //หารายจ่ายรวม
          db.executeSql('SELECT SUM(amount) AS totalExpense FROM expense WHERE type="Expense"')
          .then(res=>{
            if(res.rows.length>0){
              this.totalExpense=parseInt(res.row.item(0).totalExpense);
              this.balance=this.totalIncome-this.totalExpense;
            }
          })
          .catch(e=>console.log(e));
      }
    );
  }

  addData(){
    this.navCtrl.push(AdddataPage);
  }

  editData(rowid){
    this.navCtrl.push(EditdataPage,{ rowid : rowid });
  }

  deleteData(rowid){
    this.sqlite.create(
      {
        name: 'ionicdb.db',
        location:'default'
      }
    )
    .then(
      (db: SQLiteObject)=>{
        db.executeSql('DELETE FROM expense WHERE rowid=?',[rowid])
        .then(res=>{
          console.log(res);
          this.getData;
        })
        .catch(e=>console.log(e));
      }
    )
  }


}
