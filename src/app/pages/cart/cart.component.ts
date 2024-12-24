import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../interfaces/cart.interface';
import { Observable } from 'rxjs/internal/Observable';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    NzInputNumberModule,
    NzButtonModule,
    NzMessageModule,
    FormsModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="md:col-span-2">
          <div class="space-y-4">
            <div *ngFor="let item of cartItems$ | async; trackBy: trackByFn" 
                 class="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <img [src]="item.image" [alt]="item.name" 
                   class="w-24 h-24 object-cover rounded">
              
              <div class="flex-grow">
                <h3 class="font-semibold text-lg">{{item.name}}</h3>
                <p class="text-gray-600">{{item.price | currency}}</p>
                <p class="text-sm text-gray-500">Total: {{item.price * item.quantity | currency}}</p>
              </div>

              <div class="flex items-center gap-4">
                <nz-input-number 
                  [(ngModel)]="item.quantity"
                  [nzMin]="1"
                  [nzMax]="99"
                  [nzStep]="1"
                  [nzSize]="'large'"
                  (ngModelChange)="updateQuantity(item)">
                </nz-input-number>
                
                <button nz-button nzType="text" 
                        class="text-red-500 hover:text-red-700 transition-colors"
                        (click)="removeItem(item)">
                  <i nz-icon nzType="delete"></i>
                  Remove
                </button>
              </div>
            </div>

            <div *ngIf="(cartItems$ | async)?.length === 0" 
                 class="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <i nz-icon nzType="shopping-cart" class="text-4xl mb-4"></i>
              <p class="text-lg">Your cart is empty</p>
              <button nz-button nzType="primary" routerLink="/products" class="mt-4">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="md:col-span-1">
          <div class="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">{{subtotal$ | async | currency}}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">{{shipping$ | async | currency}}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium">{{tax$ | async | currency}}</span>
              </div>
              <div class="flex justify-between font-semibold text-lg pt-3 border-t">
                <span>Total</span>
                <span>{{total$ | async | currency}}</span>
              </div>
            </div>

            <button nz-button nzType="primary" 
                    class="w-full h-12 text-lg"
                    [disabled]="(cartItems$ | async)?.length === 0"
                    (click)="checkout()">
              Proceed to Checkout
            </button>

            <div class="mt-4 text-sm text-gray-500">
              <p class="flex items-center gap-2">
                <i nz-icon nzType="lock"></i>
                Secure checkout
              </p>
              <p class="flex items-center gap-2 mt-1">
                <i nz-icon nzType="credit-card"></i>
                We accept all major credit cards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>  `
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  
  constructor(private readonly cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  get subtotal$() { return this.cartService.subtotal$; }
  get shipping$() { return this.cartService.shipping$; }
  get tax$() { return this.cartService.tax$; }
  get total$() { return this.cartService.total$; }

  trackByFn(index: number, item: CartItem): number {
    return item.id;
  }
  
  updateQuantity(item: CartItem): void {
    this.cartService.updateCart(item);
  }
  
  removeItem(item: CartItem): void {
    this.cartService.removeItem(item);
  }

  checkout(): void {
    this.cartService.checkout();
  }
}