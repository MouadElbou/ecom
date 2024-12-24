import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, NzButtonModule, RouterLink],
  template: `
    <section class="bg-gradient-to-r from-primary to-purple-700 text-white py-32">
      <div class="container mx-auto px-4 text-center"
           [@fadeIn]>
        <h1 class="text-6xl md:text-8xl font-bold mb-8 leading-tight text-white">
          Discover Amazing Products
        </h1>
        <p class="text-2xl mb-10 opacity-90 text-white">Find the perfect items that match your style</p>
        <button nz-button nzType="default" 
                class="mt-8 px-12 h-auto py-3 text-lg hover:scale-105 transition-transform duration-300 rounded-full shadow-lg hover:shadow-xl"
                routerLink="/products">
          Shop Now
        </button>
      </div>
      
    </section>
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold mb-12 text-center relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-24 after:h-1 after:bg-primary">
        Featured Products
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
           [@staggerAnimation]>
        <app-product-card 
          *ngFor="let product of products; let i = index" 
          [product]="product"
          [@cardAnimation]="{value: '', params: {delay: i * 100}}"
          [routerLink]="['/product', product.id]">
        </app-product-card>
      </div>
    </section>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms {{delay}}ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [])
    ])
  ]
})
export class HomeComponent {
  products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 199.99,
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      image: 'https://via.placeholder.com/300'
    },
    // Add more products
  ];

}