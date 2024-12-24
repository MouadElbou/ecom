import { Injectable } from '@angular/core';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private readonly cartService: CartService) {}

  // Get cart totals from CartService
  getOrderSummary() {
    return {
      subtotal$: this.cartService.subtotal$,
      shipping$: this.cartService.shipping$,
      tax$: this.cartService.tax$,
      total$: this.cartService.total$
    };
  }
}