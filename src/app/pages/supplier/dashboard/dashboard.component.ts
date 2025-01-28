import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ProductFormComponent } from '../../../components/product-form/product-form.component';
import { Product } from '../../../../interfaces/product.interface';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzAvatarModule,
    NzBadgeModule,
    NzProgressModule,
    NzTagModule,
    NzInputModule
  ],
  template: `
    <!-- Main Dashboard Container -->
    <div class="min-h-screen bg-gray-50">
      <!-- Top Banner with Gradient -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
        <div class="container mx-auto">
          <div class="flex items-center justify-between">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <nz-avatar [nzSize]="64" nzIcon="user" class="bg-white text-blue-600"></nz-avatar>
                <div>
                  <h1 class="text-4xl font-bold mb-1">Dashboard</h1>
                  <p class="text-xl text-blue-100">{{currentDate | date:'EEEE, MMMM d'}}</p>
                </div>
              </div>
              <div class="flex gap-4 text-sm">
                <div class="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span nz-icon nzType="shop" class="mr-2"></span>
                  {{totalProducts}} Products Listed
                </div>
                <div class="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span nz-icon nzType="shopping" class="mr-2"></span>
                  {{totalOrders}} Total Orders
                </div>
              </div>
            </div>
            <button nz-button 
        class="bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 
               px-6 py-5 rounded-full backdrop-blur-sm flex items-center gap-2 
               transition-all duration-300 hover:scale-105"
        (click)="showAddProductModal()">
  <span nz-icon nzType="plus-circle" class="text-xl"></span>
  <span class="text-base font-medium">Add New Product</span>
</button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="container mx-auto px-4 -mt-8">
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <!-- Revenue Card -->
          <nz-card class="shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Revenue</p>
                <h3 class="text-2xl font-bold text-gray-800">{{revenue | currency}}</h3>
                <p class="text-green-500 text-sm">
                  <span nz-icon nzType="arrow-up"></span> 12% vs last month
                </p>
              </div>
              <div class="bg-blue-100 p-3 rounded-full">
                <span nz-icon nzType="dollar" class="text-2xl text-blue-600"></span>
              </div>
            </div>
          </nz-card>

          <!-- Orders Card -->
          <nz-card class="shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Orders</p>
                <h3 class="text-2xl font-bold text-gray-800">{{totalOrders}}</h3>
                <p class="text-green-500 text-sm">
                  <span nz-icon nzType="arrow-up"></span> 8% vs last month
                </p>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <span nz-icon nzType="shopping" class="text-2xl text-green-600"></span>
              </div>
            </div>
          </nz-card>

          <!-- Products Card -->
          <nz-card class="shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Active Products</p>
                <h3 class="text-2xl font-bold text-gray-800">{{totalProducts}}</h3>
                <nz-progress [nzPercent]="75" [nzShowInfo]="false" nzSize="small"></nz-progress>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <span nz-icon nzType="appstore" class="text-2xl text-purple-600"></span>
              </div>
            </div>
          </nz-card>

          <!-- Low Stock Card -->
          <nz-card class="shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Low Stock Items</p>
                <h3 class="text-2xl font-bold text-gray-800">{{lowStock}}</h3>
                <p class="text-red-500 text-sm">Needs attention</p>
              </div>
              <div class="bg-red-100 p-3 rounded-full">
                <span nz-icon nzType="warning" class="text-2xl text-red-600"></span>
              </div>
            </div>
          </nz-card>
        </div>

        <!-- Products Table -->
        <nz-card class="shadow-lg mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800">Product Inventory</h2>
            <div class="flex gap-4">
              <nz-input-group [nzPrefix]="searchPrefix">
                <input type="text" nz-input placeholder="Search products..."/>
              </nz-input-group>
              <button nz-button nzType="default">
                <span nz-icon nzType="filter"></span>
                Filter
              </button>
            </div>
          </div>

          <nz-table #productsTable [nzData]="products" [nzShowSizeChanger]="true">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of productsTable.data" class="hover:bg-gray-50">
                <td>
                  <div class="flex items-center gap-3">
                    <nz-avatar [nzSize]="48" [nzSrc]="product.image"></nz-avatar>
                    <div>
                      <p class="font-medium text-gray-800">{{product.name}}</p>
                      <p class="text-sm text-gray-500">ID: #{{product.id}}</p>
                    </div>
                  </div>
                </td>
                <td class="font-medium">{{product.price | currency}}</td>
                <td>
                  <nz-badge 
                    [nzStatus]="getStockStatus(product.stock)" 
                    [nzText]="product.stock + ' units'">
                  </nz-badge>
                </td>
                <td>
                  <nz-tag [nzColor]="product.stock > 0 ? 'success' : 'error'">
                    {{product.stock > 0 ? 'In Stock' : 'Out of Stock'}}
                  </nz-tag>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button nz-button nzType="primary" nzGhost (click)="editProduct(product)">
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button nz-button nzDanger nzGhost (click)="deleteProduct(product)">
                      <span nz-icon nzType="delete"></span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </nz-card>
      </div>
    </div>

    <ng-template #searchPrefix>
      <span nz-icon nzType="search"></span>
    </ng-template>
  `,
  styles: [`
    :host ::ng-deep {
      .ant-card {
        border-radius: 12px;
      }
      .ant-table-thead > tr > th {
        background: #f9fafb;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  revenue = 0;
  lowStock = 0;
  products: any[] = [];

  constructor(
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    // Will be replaced with actual API calls
    this.loadDashboardData();
  }

  showAddProductModal() {
    this.modal.create({
      nzTitle: 'Add New Product',
      nzContent: ProductFormComponent,
      nzFooter: null,
      nzWidth: 720
    });
  }

  editProduct(product: Product) {
    this.modal.create({
      nzTitle: 'Edit Product',
      nzContent: ProductFormComponent,
      nzData: { product },
      nzFooter: null,
      nzWidth: 720
    });
  }

  deleteProduct(product: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this product?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        // Will implement delete logic
        this.message.success('Product deleted successfully');
      },
      nzCancelText: 'No'
    });
  }
  currentDate = new Date();

  getStockStatus(stock: number): 'success' | 'warning' | 'error' {
    if (stock > 10) return 'success';
    if (stock > 0) return 'warning';
    return 'error';
  }

  private loadDashboardData() {
    // Placeholder data until backend is ready
    this.totalProducts = 15;
    this.totalOrders = 45;
    this.revenue = 12500;
    this.lowStock = 3;
    this.products = [
      {
        id: 1,
        name: 'Sample Product',
        price: 99.99,
        stock: 5,
        image: 'assets/sample-product.jpg'
      }
    ];
  }
}

