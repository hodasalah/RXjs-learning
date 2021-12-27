import { Component } from '@angular/core';

import { EMPTY, combineLatest, Subject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  //selectedCategoryId = 1;

  products$ = this.productService.productsWithCategories$.pipe(catchError((err) => {
    this.errorMessage = err;
    return EMPTY;
  }));
  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  productsWithAction$ = combineLatest([this.products$, this.categorySelectedAction$.pipe(startWith(0))])
    .pipe(
      map(([products$, selectedCategoryId]) => products$.filter(p => selectedCategoryId ? p.categoryId === selectedCategoryId : true)),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY
      })
    )
  categories$ = this.productCategoryService.productCategories$.pipe(catchError(err => {
    this.errorMessage = err;
    return EMPTY
  }))

  // using normal filter array method to filter products
  // productsSimpleFilter$ = this.productService.productsWithCategories$.pipe(map(products => products.filter(p => this.selectedCategoryId ? p.categoryId === this.selectedCategoryId : true)))


  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }





  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    // this.selectedCategoryId = +categoryId
    this.categorySelectedSubject.next(+categoryId)
  }
}
