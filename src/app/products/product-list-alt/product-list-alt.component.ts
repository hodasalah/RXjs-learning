import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent implements OnInit {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId: number;

  products$!: Observable<Product[]> ;
  sub: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts()

  }



  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
