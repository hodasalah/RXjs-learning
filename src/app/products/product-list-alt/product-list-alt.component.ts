import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EMPTY, Observable, of, Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  //changeDetection component won't update unless we emit an item
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId: number;

  products$ = this.productService.productsWithCategories$.pipe(catchError(err => {
    this.errorMessage = err;
    // return of([])=== EMPTY
    return EMPTY
  }))



  constructor(private productService: ProductService) { }





  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
