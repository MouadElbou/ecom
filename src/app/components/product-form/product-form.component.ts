  import { Component, Input, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { NzFormModule } from 'ng-zorro-antd/form';
  import { NzInputModule } from 'ng-zorro-antd/input';
  import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
  import { NzUploadModule } from 'ng-zorro-antd/upload';
  import { NzButtonModule } from 'ng-zorro-antd/button';
  import { NzModalRef } from 'ng-zorro-antd/modal';
  import { NzMessageService } from 'ng-zorro-antd/message';
import { Product } from '../../../interfaces/product.interface';
import { NzIconModule } from 'ng-zorro-antd/icon';

  @Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      NzFormModule,
      NzInputModule,
      NzInputNumberModule,
      NzUploadModule,
      NzButtonModule,
      NzIconModule
    ],
    template: `
      <div class="p-6">
        <!-- Form Header -->
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold text-gray-800">
            {{editMode ? 'Edit Product' : 'Add New Product'}}
          </h2>
          <p class="text-gray-500">Fill in the details to {{editMode ? 'update' : 'create'}} your product</p>
        </div>

        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Image Upload Section -->
          <div class="mb-8 flex justify-center">
            <div class="relative group">
              <nz-upload
                [nzAction]="uploadUrl"
                [nzListType]="'picture-card'"
                [nzShowUploadList]="false"
                (nzChange)="handleImageUpload($event)"
                class="w-40 h-40">
                <ng-container *ngIf="!imageUrl">
                  <div class="flex flex-col items-center justify-center h-full">
                    <span nz-icon nzType="plus" class="text-2xl mb-2"></span>
                    <div class="text-sm text-gray-500">Upload Image</div>
                  </div>
                </ng-container>
                <img *ngIf="imageUrl" [src]="imageUrl" 
                   class="w-full h-full object-cover rounded-lg"/>
              </nz-upload>
              <div *ngIf="imageUrl" 
                 class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 rounded-lg flex items-center 
                          justify-center">
                <button nz-button nzType="link" class="text-white" (click)="removeImage()">
                  <span nz-icon nzType="delete"></span>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name Input -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input nz-input formControlName="name" 
                   class="w-full rounded-lg border-gray-200 focus:border-blue-500 
                            focus:ring-2 focus:ring-blue-200 transition-all"
                   placeholder="Enter product name"/>
              <div *ngIf="productForm.get('name')?.touched && productForm.get('name')?.invalid" 
                 class="text-red-500 text-sm mt-1">
                Product name is required
              </div>
            </div>

            <!-- Price Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <nz-input-number formControlName="price"
                              class="w-full"
                              [nzMin]="0"
                              [nzStep]="0.01"
                              [nzPrecision]="2"
                              [nzPlaceHolder]="'Enter price'">
              </nz-input-number>
              <div *ngIf="productForm.get('price')?.touched && productForm.get('price')?.invalid" 
                 class="text-red-500 text-sm mt-1">
                Valid price is required
              </div>
            </div>

            <!-- Stock Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <nz-input-number formControlName="stock"
                              class="w-full"
                              [nzMin]="0"
                              [nzStep]="1"
                              [nzPlaceHolder]="'Enter stock quantity'">
              </nz-input-number>
              <div *ngIf="productForm.get('stock')?.touched && productForm.get('stock')?.invalid" 
                 class="text-red-500 text-sm mt-1">
                Stock quantity is required
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4 pt-6 border-t">
            <button nz-button nzType="default" 
                    class="px-6 rounded-full hover:bg-gray-100 transition-colors"
                    (click)="closeModal()">
              Cancel
            </button>
            <button nz-button nzType="primary" 
                    [disabled]="!productForm.valid"
                    class="px-6 rounded-full hover:opacity-90 transition-opacity"
                    type="submit">
              {{editMode ? 'Update' : 'Create'}} Product
            </button>
          </div>
        </form>
      </div>
    `,
    styles: [`
      :host ::ng-deep {
        .ant-upload.ant-upload-select {
          @apply w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 
               hover:border-blue-500 transition-colors
        }
        .ant-input-number {
          @apply w-full rounded-lg
        }
      }
    `]
  })
  export class ProductFormComponent implements OnInit {
    @Input() data: { product: Product } | undefined;
    productForm: FormGroup;
    editMode = false;
    imageUrl: string = '';
    uploadUrl = 'your-upload-endpoint'; // Will be replaced with actual endpoint

    constructor(
      private readonly fb: FormBuilder,
      private readonly modal: NzModalRef,
      private readonly message: NzMessageService
    ) {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        image: ['']
      });
    }

    ngOnInit() {
      if (this.data?.product) {
        this.editMode = true;
        this.imageUrl = this.data.product.image;
        this.productForm.patchValue(this.data.product);
      }
    }

    handleImageUpload(info: any) {
      if (info.file.status === 'done') {
        this.imageUrl = info.file.response.url;
        this.productForm.patchValue({ image: this.imageUrl });
      }
    }

    onSubmit() {
      if (this.productForm.valid) {
        const productData = this.productForm.value;
        // Will be replaced with actual API call
        this.message.success(`Product ${this.editMode ? 'updated' : 'created'} successfully`);
        this.modal.close(productData);
      }
    }

    closeModal() {
      this.modal.close();
    }
    removeImage(): void {
        this.imageUrl = '';
        this.productForm.patchValue({ image: '' });
      }
  }