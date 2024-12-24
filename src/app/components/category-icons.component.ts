import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-icons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div *ngFor="let category of categories" 
           class="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition">
        <img [src]="'assets/icons/' + category.icon" 
             [alt]="category.name"
             class="w-12 h-12 mb-2">
        <span class="text-sm font-medium">{{category.name}}</span>
      </div>
    </div>
  `
})
export class CategoryIconsComponent {
  categories = [
    { name: 'Electronics', icon: 'electronics.svg' },
    { name: 'Fashion', icon: 'fashion.svg' },
    { name: 'Sports', icon: 'sports.svg' },
    { name: 'Books', icon: 'books.svg' },
    { name: 'Home', icon: 'home.svg' }
  ];
}
