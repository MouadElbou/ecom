import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-offer-management',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzDatePickerModule,
    NzInputModule,
    ReactiveFormsModule,
    NzCardModule,
    NzSelectModule,
    FormsModule,
    NzAvatarModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
        <div class="container mx-auto">
          <div class="flex items-center justify-between">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div>
                  <h1 class="text-4xl font-bold mb-1">Offer Management</h1>
                  <p class="text-xl text-purple-100">Create and manage special offers</p>
                </div>
              </div>
              <div class="flex gap-4 text-sm">
                <div class="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span nz-icon nzType="gift" class="mr-2"></span>
                  {{activeOffers}} Active Offers
                </div>
                <div class="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span nz-icon nzType="calendar" class="mr-2"></span>
                  {{scheduledOffers}} Scheduled
                </div>
              </div>
            </div>
            <button nz-button 
                    class="bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 
                           px-6 py-5 rounded-full backdrop-blur-sm flex items-center gap-2 
                           transition-all duration-300 hover:scale-105"
                    (click)="createOffer()">
              <span nz-icon nzType="plus-circle" class="text-xl"></span>
              <span class="text-base font-medium">Create New Offer</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="container mx-auto px-4 -mt-8">
        <nz-card class="shadow-lg rounded-xl">
          <!-- Filters -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex gap-4">
              <nz-range-picker class="w-64"></nz-range-picker>
              <nz-select class="w-48" [ngModel]="'all'" nzPlaceHolder="Status">
                <nz-option nzValue="all" nzLabel="All Status"></nz-option>
                <nz-option nzValue="active" nzLabel="Active"></nz-option>
                <nz-option nzValue="scheduled" nzLabel="Scheduled"></nz-option>
                <nz-option nzValue="expired" nzLabel="Expired"></nz-option>
              </nz-select>
            </div>
            <nz-input-group [nzSuffix]="suffixIconSearch" class="w-64">
              <input type="text" nz-input placeholder="Search offers..." />
            </nz-input-group>
          </div>

          <!-- Offers Table -->
          <nz-table #offersTable [nzData]="offers">
            <thead>
              <tr>
                <th>Offer Details</th>
                <th>Products</th>
                <th>Discount</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let offer of offersTable.data">
                <td>
                  <div class="flex items-center gap-3">
                    <nz-avatar [nzSize]="48" [nzSrc]="offer.image"></nz-avatar>
                    <div>
                      <p class="font-medium text-gray-800">{{offer.name}}</p>
                      <p class="text-sm text-gray-500">ID: #{{offer.id}}</p>
                    </div>
                  </div>
                </td>
                <td>{{offer.productsCount}} products</td>
                <td>
                  <span class="text-lg font-semibold text-green-600">
                    {{offer.discount}}% OFF
                  </span>
                </td>
                <td>
                  <div class="text-sm">
                    <p>Starts: {{offer.startDate | date:'mediumDate'}}</p>
                    <p>Ends: {{offer.endDate | date:'mediumDate'}}</p>
                  </div>
                </td>
                <td>
                  <nz-tag [nzColor]="getStatusColor(offer.status)">
                    {{offer.status}}
                  </nz-tag>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button nz-button nzType="primary" nzGhost (click)="editOffer(offer)">
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button nz-button nzDanger nzGhost (click)="deleteOffer(offer)">
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

    <ng-template #suffixIconSearch>
      <span nz-icon nzType="search"></span>
    </ng-template>
  `
})
export class OfferManagementComponent implements OnInit {
  activeOffers = 0;
  scheduledOffers = 0;
  offers: any[] = [];

  ngOnInit() {
    // Sample data - replace with API calls
    this.loadOffers();
  }

  getStatusColor(status: string): string {

    const colors: { [key: string]: string } = {
      'Active': 'success',
      'Scheduled': 'processing',
      'Expired': 'default'
    };
    return colors[status] || 'default';

  }
  createOffer() {
    // Implement offer creation modal
  }

  editOffer(offer: any) {
    // Implement offer editing
  }

  deleteOffer(offer: any) {
    // Implement offer deletion
  }

  private loadOffers() {
    // Sample data
    this.offers = [
      {
        id: 1,
        name: 'Summer Sale',
        image: 'assets/offer1.jpg',
        productsCount: 15,
        discount: 25,
        startDate: new Date(),
        endDate: new Date(Date.now() + 864000000),
        status: 'Active'
      }
    ];
    
    this.activeOffers = this.offers.filter(o => o.status === 'Active').length;
    this.scheduledOffers = this.offers.filter(o => o.status === 'Scheduled').length;
  }
}