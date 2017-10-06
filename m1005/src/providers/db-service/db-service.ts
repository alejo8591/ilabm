import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {Platform} from "ionic-angular";

@Injectable()
export class DbServiceProvider {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject)=>{
        this.database = db;
        this.createTable()
          .then(() => {
            this.dbReady.next(true);
          })
          .catch(err=>console.error("error detected creating tables: ", err));
      })
    });
  }

  private createTable() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );`,{})
      .then(result => {
        console.debug(result);
      })
      .catch(err=>console.error("error detected creating tables: ", err));
  }

  private isReady() {
    return new Promise((resolve, reject) => {
      if(this.dbReady.getValue()) {
        resolve();
      } else {
        this.dbReady.subscribe(ready => {
          if(ready) resolve();
        });
      }
    })
  }

  getProducts() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql("SELECT * FROM products", [])
          .then(data => {
            let products = [];
            for(let i=0; i<data.rows.length; i++){
              products.push(data.rows.item(i));
            }
            return products;
          })
          .catch(err => console.error(err));
      })
      .catch(err=>console.error("not ready: ", err));
  }

  getProduct(id: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT * FROM products WHERE id = ${id}`, [])
          .then(data => {
            if(data.rows.length) return data.rows.item(0);
            return null;
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  addProduct(name: string) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`INSERT INTO products(name) VALUES ('${name}');`, {})
          .then(result => {
            if(result.insertId) return this.getProduct(result.insertId);
          })
          .catch(err => console.error(err));
      });
  }

  deleteProduct(id: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`DELETE FROM products WHERE id = ${id}`, [])
      })
      .catch(err => console.error(err));
  }
}
