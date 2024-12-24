import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-[400px] bg-primary overflow-hidden">
      <img 
        src="assets/images/banner/hero-bg.jpg" 
        alt="Banner" 
        class="absolute inset-0 w-full h-full object-cover opacity-20"
      >
      <div class="container mx-auto px-4 h-full flex items-center relative z-10">
        <div class="max-w-xl text-white">
          <h1 class="text-5xl font-bold mb-4">Summer Collection</h1>
          <p class="text-xl mb-8">Discover our latest arrivals and exclusive deals</p>
          <button class="bg-white text-primary px-8 py-3 rounded-full font-semibold">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  `
})
export class BannerComponent {}
