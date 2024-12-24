import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../../interfaces/cart.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private readonly router: Router) {}

  private readonly cartItems = new BehaviorSubject<CartItem[]>(this.getStoredCart());
  cartItems$ = this.cartItems.asObservable();
  
  // Fixed values for shipping and tax rates
  private readonly SHIPPING_RATE = 10;
  private readonly TAX_RATE = 0.08;

  // New observables for cart totals
  subtotal$ = this.cartItems$.pipe(
    map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
  );

  shipping$ = this.cartItems$.pipe(
    map(items => items.length > 0 ? this.SHIPPING_RATE : 0)
  );

  tax$ = this.subtotal$.pipe(
    map(subtotal => subtotal * this.TAX_RATE)
  );

  total$ = this.cartItems$.pipe(
    map(items => {
      const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const shipping = items.length > 0 ? this.SHIPPING_RATE : 0;
      const tax = subtotal * this.TAX_RATE;
      return subtotal + shipping + tax;
    })
  );
  
  addToCart(item: CartItem) {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(i => i.id === item.id);
  
    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { ...item, quantity: 1 }]);
    }
    this.updateLocalStorage(this.cartItems.getValue());
  }
  


  private getStoredCart(): CartItem[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  private updateLocalStorage(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  updateCart(item: CartItem) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.map(i => 
      i.id === item.id ? {...i, quantity: item.quantity} : i
    );
    this.cartItems.next(updatedItems);
    this.updateLocalStorage(updatedItems);
  }

  removeItem(item: CartItem) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(i => i.id !== item.id);
    this.cartItems.next(updatedItems);
    this.updateLocalStorage(updatedItems);
  }

  checkout() {
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }
}