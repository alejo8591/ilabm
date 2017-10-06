import { Component } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductServiceProvider} from "../../providers/product-service/product-service";

@IonicPage()
@Component({
  selector: 'page-product-modal',
  templateUrl: 'product-modal.html',
})
export class ProductModalPage {

  myForm: FormGroup;

  constructor(public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              private productServiceProvider :ProductServiceProvider) {
    this.myForm = this.createForm();
  }

  private createForm() {
    return this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
    });
  }

  public saveForm() {
    this.productServiceProvider.addProduct(this.myForm.value.name)
      .then(result => {
        console.debug(result);
        this.dismiss();
      })
      .catch(err=>console.error("error create product: ", err));
  }

  public dismiss() {
    let data = {};
    this.viewCtrl.dismiss(data);
  }
}
