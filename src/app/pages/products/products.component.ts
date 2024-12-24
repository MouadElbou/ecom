import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component'; 
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    NzSelectModule,
    NzSliderModule,
    NzSkeletonModule,
    NzEmptyModule,
    FormsModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Filters Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Filters</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <nz-select 
                class="w-full" 
                [(ngModel)]="selectedCategory" 
                nzPlaceHolder="All Categories"
                nzAllowClear>
                <nz-option nzValue="" nzLabel="All Categories"></nz-option>
                <nz-option *ngFor="let cat of categories" [nzValue]="cat" [nzLabel]="cat">
                </nz-option>
              </nz-select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Price Range</label>
              <nz-slider 
                [nzRange]="true" 
                [(ngModel)]="priceRange" 
                [nzMin]="0" 
                [nzMax]="2000" 
                [nzStep]="10"
                [nzTipFormatter]="sliderFormatter">
              </nz-slider>
              <div class="flex justify-between text-sm text-gray-600">
                <span>{{priceRange[0] | currency}}</span>
                <span>{{priceRange[1] | currency}}</span>
              </div>
            </div>

            <button 
              class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              (click)="resetFilters()">
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="md:col-span-3">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">
              {{selectedCategory || 'All'}} Products 
              <span class="text-sm text-gray-500">({{filteredProducts.length}} items)</span>
            </h2>
            <nz-select [(ngModel)]="sortBy" class="w-48" nzPlaceHolder="Sort by">
              <nz-option nzValue="price-asc" nzLabel="Price: Low to High"></nz-option>
              <nz-option nzValue="price-desc" nzLabel="Price: High to Low"></nz-option>
              <nz-option nzValue="name" nzLabel="Name"></nz-option>
            </nz-select>
          </div>

          <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <nz-skeleton *ngFor="let i of [1,2,3]" [nzActive]="true"></nz-skeleton>
          </div>

          <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <app-product-card 
              *ngFor="let product of filteredProducts" 
              [product]="product"
              (click)="onProductSelect(product)">
            </app-product-card>
          </div>

          <div *ngIf="!loading && filteredProducts.length === 0" class="text-center py-8">
            <nz-empty 
              [nzNotFoundContent]="'No products found matching your criteria'"
              [nzNotFoundFooter]="footerTpl">
            </nz-empty>
            <ng-template #footerTpl>
              <button 
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                (click)="resetFilters()">
                Reset Filters
              </button>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `],
})
export class ProductsComponent {
  categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];
  selectedCategory = '';
  priceRange = [0, 1000];
  sortBy = 'price-asc';
  loading = false;

  products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 199.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300',
      description: 'High-quality wireless headphones with noise cancellation',
      rating: 4.5,
      stock: 15
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300',
      description: 'Feature-rich smartwatch with health tracking',
      rating: 4.2,
      stock: 8
    },
    {
      id: 3,
      name: 'Cotton T-Shirt',
      price: 29.99,
      category: 'Clothing',
      image: 'assets/images/tshirt-template.png',
      description: 'Comfortable cotton t-shirt for everyday wear',
      rating: 4.0,
      stock: 50
    },
    {
      id: 4,
      name: 'JavaScript Guide',
      price: 49.99,
      category: 'Books',
      image: 'https://via.placeholder.com/300',
      description: 'Comprehensive guide to modern JavaScript',
      rating: 4.8,
      stock: 20
    },
    {
      id: 5,
      name: 'Garden Tools Set',
      price: 149.99,
      category: 'Home & Garden',
      image: 'https://via.placeholder.com/300',
      description: 'Complete set of essential garden tools including a trowel, pruning shears',      rating: 4.3,
      stock: 12
    }
  ];


  sliderFormatter = (value: number): string => `${value}`;

  get filteredProducts() {
    return this.products
      .filter(p => !this.selectedCategory || p.category === this.selectedCategory)
      .filter(p => p.price >= this.priceRange[0] && p.price <= this.priceRange[1])
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'name': return a.name.localeCompare(b.name);
          default: return 0;
        }
      });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.priceRange = [0, 1000];
    this.sortBy = 'price-asc';
  }

  onProductSelect(product: any): void {
    console.log('Selected product:', product);
    // Implement navigation or modal display logic here
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}