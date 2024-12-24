import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NzButtonModule, RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
         [routerLink]="['/products', product.id]">
      <img [src]="product.image" [alt]="product.name" class="w-full h-48 object-contain rounded-t-lg">
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
        <p class="text-gray-600 mt-2">{{ product.price | currency }}</p>
        <p *ngIf="product.description" class="text-gray-500 text-sm mt-2">{{ product.description }}</p>
        <button nz-button nzType="primary" class="mt-4 w-full" 
                (click)="onAddToCart(); $event.stopPropagation()">
          Add to Cart
        </button>
        <button nz-button nzType="default" class="mt-2 w-full" 
                [routerLink]="['/product-designer']" 
                (click)="$event.stopPropagation()">
          Design Product
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  
  constructor(private readonly cartService: CartService) {}

  onAddToCart(): void {
    this.cartService.addToCart({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: 1,
      image: this.product.image
    });
  }
}