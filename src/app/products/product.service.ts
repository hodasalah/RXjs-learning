import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, merge, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, map, scan } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryData } from './../product-categories/product-category-data';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;
  products$: Observable<Product[]> = this.http.get<Product[]>(this.productsUrl)
  productsWithCategories$ = combineLatest([this.products$, this.productCategoryService.productCategories$]).pipe(map(([products, categories]) => products.map(product => ({
    ...product,
    price: product.price * 1.5,
    searchKey: [product.productName],
    category: categories.find(c => c.id === product.categoryId).name
  }) as Product)), catchError(this.handleError))

  // select product using action
  private productSelectedSubject = new BehaviorSubject<number>(1)
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  selectedProductChanged(productID) {
    this.productSelectedSubject.next(productID)
  }


  product$ = combineLatest([
    this.productsWithCategories$,
    this.productSelectedAction$])
    .pipe(
      map(([products, productSelectedId]) => {
        return products.find(product => product.id === productSelectedId)
      }),
      tap(product => console.log(JSON.stringify(product))), catchError(this.handleError)
    )
  constructor(private http: HttpClient,
    private supplierService: SupplierService,
    private productCategoryService: ProductCategoryService) { }
  // addNew product using merge and scan
  private addProductSubject = new Subject<Product>();
  addProductAction$ = this.addProductSubject.asObservable();

  addProductAndMergeWithProducts = merge(this.productsWithCategories$, this.addProductAction$).pipe(
    scan((acc: Product[], value: Product) => [...acc, value])
  )
  addProduct(newProduct?: Product) {
    newProduct = newProduct || this.fakeProduct()
    this.addProductSubject.next(newProduct)
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
