import { Component } from '@angular/core';
import { RouterOutlet,RouterLink  } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { map } from 'rxjs/operators';
import { CartService } from './services/cart.service';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    RouterLink
  ],
  template: `
    <nz-layout class="min-h-screen">
      <nz-header class="w-full z-50 bg-white shadow-md sticky top-0" [@slideDown]>
        <div class="container mx-auto px-4 flex items-center justify-between h-16">
          <a routerLink="/" class="text-2xl font-bold text-primary hover:scale-105 transition-transform duration-300 cursor-pointer">
            <span class="text-blue-600">E</span>Shop
          </a>
          
          <div class="flex items-center space-x-6">
            <nz-input-group [nzPrefix]="searchPrefix" class="hidden md:flex w-96" [@fadeIn]>
              <input type="text" nz-input placeholder="Search products..." 
                class="rounded-lg hover:border-primary focus:border-primary transition-all duration-300 focus:outline-none focus:shadow-lg" />
            </nz-input-group>
                          <button routerLink="cart" nz-button nzType="text" class="hover:rotate-12 transition-transform duration-300 relative">
                            <span nz-icon nzType="shopping-cart" class="text-xl"></span>
                            <span class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                              {{ cartCount$ | async }}
                            </span>
                          </button>
            <button nz-button nzType="text" class="hover:scale-110 transition-transform duration-300">
              <span nz-icon nzType="user" class="text-xl"></span>
            </button>
          </div>
        </div>
      </nz-header>

      <nz-content [@fadeIn]>
        <router-outlet></router-outlet>
      </nz-content>
    </nz-layout>

    <ng-template #searchPrefix>
      <span nz-icon nzType="search" class="text-gray-400 flex items-center hover:text-primary transition-colors"></span>
    </ng-template>
  `,
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})

export class AppComponent {

  title = 'EcommerceApp'; // Add this line

  cartCount$: Observable<number>

  constructor(private readonly cartService: CartService) {
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    )
  }
}

