import { EditdataPage } from './../editdata/editdata';
import { AdddataPage } from './../adddata/adddata';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

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
  i="";
  constructor(public navCtrl: NavController, public sqlite : SQLite, public toast: Toast) {
  }

  ionViewDidLoad(){
    this.getData();
  }

  ionViewWillEnter(){
    this.getData();
  }

  //method getdata จะเป็น method สำหรับแสดงตารางและสร้างตารางถ้าไม่มีจะสร้างตารางให้ก่อน
  getData(){
    this.sqlite.create({  //สร้างฐานข้อมูล
      name:'ionicdb.db', //ชื่อฐานข้อมูล
      location:'default' //ตำแหน่งที่เก็บในเครื่องให้เป็น default
    }).then( //เมื่อสร้างแล้วให้ทำงานหลัง then
      (db: SQLiteObject)=>{ //สร้าง method db แล้วทำงาน
        db.executeSql('CREATE TABLE IF NOT EXISTS expense (rowid INTEGER PRIMARY KEY, date TEXT, type TEXT, description TEXT, amount INTEGER)',[]) //คำสั่ง SQL จะเช็คว่ามีตารางในฐานข้อมูลแล้วรึยังถ้าไม่มีจะสร้างขึ้นมา
          .then(res=>{console.log('Executed SQL')}) //เมื่อ executeSql สำเร็จแล้วให้ทำงานต่อ แสดง Executed SQL
          .catch(e=>{  //หลังเกิด Error แล้วให้แสดง popup แบบ toast
            console.log(e);
            this.toast.show(e.message,'3000','center') //แสดง e คือ แสดง error ว่าเกิดอะไร popup toast 3 วินาที
            .subscribe(toast=>{ //subscribe คือ หลังจากแสดงผล toast แล้วให้ทำอะไรต่อ
              console.log(toast); //แสดงข้อมูล toast
            })
          });//แต่เมื่อ SQL เกิด Error ให้ตกมาอยู่ที่ catch แล้วให้  console แสดงผลแล้วจะได้รู้ว่าเกิดจากอะไร
            
          db.executeSql('SELECT * FROM expense ORDER BY rowid DESC',[])
            .then(res=>{ //เมื่อเสร็จแล้วให้ทำงานหลัง then res กำหนดตัวแปรเพื่อมาส่งค่า  // res เป็นผลที่ได้หลังจากการ query
              this.expenses=[]; //นำข้อมูลที่ได้จากการ executeSql มาอยู่ในตัวแปร expenses ที่เป็น array
              for(var i=0;i<res.rows.length;i++){  //อ่านค่าทุกแถวแล้วมาใส่ในตัวแปร expenses ที่เป็น array ที่ละแถว
                this.expenses.push({ //push เป็นการนำข้อมูลใส่ในตัวแปร expenses
                  rowid: res.rows.item(i).rowid, //สร้าง ตัวแปร rowid แล้วเก็บค่าของแถว rowid
                  date: res.rows.item(i).date,
                  type: res.rows.item(i).type,
                  description: res.rows.item(i).description,
                  amount: res.rows.item(i).amount
                });
              }
            }) 
            .catch(e=>{  //หลังเกิด Error แล้วให้แสดง popup แบบ toast
              console.log(e);
              this.toast.show(e.message,'3000','center') //แสดง e คือ แสดง error ว่าเกิดอะไร popup toast 3 วินาที
              .subscribe(toast=>{ //subscribe คือ หลังจากแสดงผล toast แล้วให้ทำอะไรต่อ
                console.log(toast); //แสดงข้อมูล toast
              })
            });
          
          //หารายรับรวม
          db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"',[])
          .then(res=>{
            if(res.rows.length>0){
              this.totalIncome=parseInt(res.rows.item(0).totalIncome);
            }else{
              this.totalIncome=0;
            }
            this.balance=this.totalIncome-this.totalExpense;
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

          //หารายจ่ายรวม
          db.executeSql('SELECT SUM(amount) AS totalExpense FROM expense WHERE type="Expense"',[])
          .then(res=>{
            if(res.rows.length>0){
              this.totalExpense=parseInt(res.rows.item(0).totalExpense);
            }else{
              this.totalExpense=0;
            }
            this.balance=this.totalIncome-this.totalExpense;
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
          this.getData(); //กลับไปใช้ getData เพื่อ แสดงหน้ารายการใหม่อีกครั้ง
        })
        .catch(e=>console.log(e));
      }
    )
    .catch(e=>console.log(e));
  }

}
