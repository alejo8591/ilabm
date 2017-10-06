import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {DbServiceProvider} from "../db-service/db-service";

@Injectable()
export class ProductServiceProvider {

  public listProducts: any;

  constructor(public database:DbServiceProvider) {
    this.getProducts();
  }

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
        if (data) {
          for(let item of data) {
            listProducts.push(item);
          }
        }
        this.listProducts = listProducts;
      })
      .catch(err=>console.error("error list of products: ", err));
  }

  public getProduct(id: number) {
    return this.database.getProduct(id)
      .then((data:any) => {
        return data;
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
