import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {DbServiceProvider} from "../db-service/db-service";

@Injectable()
export class ProductServiceProvider {

  private listProducts: any;

  constructor(public database:DbServiceProvider) {}

  public addProduct(name: string){
    return this.database.addProduct(name)
      .then(list => {
        return this.getProducts()
          .then(() => {
            return list;
          })
          .catch(err=>console.error("error create product: ", err));
    });
  }

  public getProducts() {
    return this.database.getProducts()
      .then((data:any) => {
        let listProducts: any = [];
        if(data) {
          for(let list of data) {
            listProducts.push(list.name);
          }
        }
        this.listProducts = listProducts;
      })
      .catch(err=>console.error("error list of products: ", err));
  }


  public removeProduct(products: any) {
    return this.database.deleteProduct(products.id)
      .then(() => {
        return this.getProducts();
      })
      .catch(err=>console.error("error remove product: ", err));
  }
}
