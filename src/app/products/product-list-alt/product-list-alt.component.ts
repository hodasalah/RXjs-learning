import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EMPTY, Observable, of, Subject, Subscription } from 'rxjs';

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
  private errorMessageSubject = new Subject<string>();
  
  errorMessage$=this.errorMessageSubject.asObservable();
  
  selectedProductId$ = this.productService.product$;

  products$ = this.productService.addProductAndMergeWithProducts.pipe(catchError(err => {
  this.errorMessageSubject.next(err)
    // return of([])=== EMPTY
    return EMPTY
  }))



  constructor(private productService: ProductService) { }





  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId)
  }
}
