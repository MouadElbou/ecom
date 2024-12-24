import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzStepsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <nz-steps [nzCurrent]="currentStep">
        <nz-step nzTitle="Shipping" nzDescription="Delivery details"></nz-step>
        <nz-step nzTitle="Payment" nzDescription="Payment method"></nz-step>
        <nz-step nzTitle="Review" nzDescription="Order summary"></nz-step>
      </nz-steps>

      <div class="mt-8 max-w-2xl mx-auto">
        <!-- Shipping Form -->
        <form *ngIf="currentStep === 0" [formGroup]="shippingForm" class="space-y-6">
          <nz-form-item>
            <nz-form-label [nzSm]="3" [nzXs]="24" nzRequired nzFor="email">Full Name</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="fullName" placeholder="Enter your full name"/>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSm]="3" [nzXs]="24" nzRequired nzFor="email">Address</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="address" placeholder="Street address"/>
            </nz-form-control>
          </nz-form-item>

          <div class="grid grid-cols-2 gap-4">
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="email">City</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="city"/>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired nzFor="email">Postal Code</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="postalCode"/>
              </nz-form-control>
            </nz-form-item>
          </div>
        </form>

        <!-- Payment Form -->
        <form *ngIf="currentStep === 1" [formGroup]="paymentForm" class="space-y-6">
          <nz-form-item>
            <nz-form-label [nzSm]="3" [nzXs]="24" nzRequired nzFor="email">Card Number</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="cardNumber" placeholder="1234 5678 9012 3456"/>
            </nz-form-control>
          </nz-form-item>

          <div class="grid grid-cols-3 gap-4">
            <nz-form-item>
              <nz-form-label [nzSm]="20" [nzXs]="2" nzRequired nzFor="email">Expiration Date</nz-form-label>
              <nz-form-control>
                <div class="flex gap-2">
                  <nz-select formControlName="expiryMonth" class="w-1/2">
                    <nz-option *ngFor="let month of months" [nzValue]="month" [nzLabel]="month"></nz-option>
                  </nz-select>
                  <nz-select formControlName="expiryYear" class="w-1/2">
                    <nz-option *ngFor="let year of years" [nzValue]="year" [nzLabel]="year"></nz-option>
                  </nz-select>
                </div>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="5" [nzXs]="24" nzRequired nzFor="email">CVV</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="cvv" maxlength="4"/>
              </nz-form-control>
            </nz-form-item>
          </div>
        </form>
          <!-- Order Review -->
          <div *ngIf="currentStep === 2" class="space-y-6">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">Order Summary</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>{{ orderSummary.subtotal$ | async | currency }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Shipping</span>
                  <span>{{ orderSummary.shipping$ | async | currency }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Tax</span>
                  <span>{{ orderSummary.tax$ | async | currency }}</span>
                </div>
                <div class="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{{ orderSummary.total$ | async | currency }}</span>
                </div>
              </div>
            </div>
          </div>
        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          <button 
            nz-button 
            *ngIf="currentStep > 0" 
            (click)="prevStep()">
            Previous
          </button>
          <button 
            nz-button 
            nzType="primary" 
            *ngIf="currentStep < 2" 
            (click)="nextStep()"
            [disabled]="!canProceed()">
            Next
          </button>
          <button 
            nz-button 
            nzType="primary" 
            *ngIf="currentStep === 2" 
            (click)="placeOrder()">
            Place Order
          </button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  currentStep = 0;
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  months = Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0'));
  years = Array.from({length: 10}, (_, i) => String(new Date().getFullYear() + i));
  orderSummary: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly message: NzMessageService,
    private readonly checkoutService: CheckoutService,
  ) { 
    this.orderSummary = this.checkoutService.getOrderSummary();
    
    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required]
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  nextStep(): void {
    if (this.canProceed()) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  canProceed(): boolean {
    if (this.currentStep === 0) {
      return this.shippingForm.valid;
    }
    if (this.currentStep === 1) {
      return this.paymentForm.valid;
    }
    return true;
  }

  placeOrder(): void {
    this.message.success('Order placed successfully!');
    // Implement order placement logic here
  }
}