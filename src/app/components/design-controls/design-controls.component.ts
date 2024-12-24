  import { Component, Input, Output, EventEmitter } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { NzSelectModule } from 'ng-zorro-antd/select';
  import { NzButtonModule } from 'ng-zorro-antd/button';
  import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
  import { FormsModule } from '@angular/forms';
  import { NzSliderModule } from 'ng-zorro-antd/slider';

  @Component({
    selector: 'app-design-controls',
    standalone: true,
    imports: [
      CommonModule,
      NzSelectModule,
      NzButtonModule,
      NzUploadModule,
      NzSliderModule,
      FormsModule
    ],
    template: `
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-bold mb-6">Design Controls</h2>
      
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-2">Product Type</label>
            <nz-select [(ngModel)]="productType" 
                      (ngModelChange)="onProductTypeChange($event)" 
                      class="w-full">
              <nz-option nzValue="shirt" nzLabel="T-Shirt"></nz-option>
              <nz-option nzValue="pen" nzLabel="Pen"></nz-option>
              <nz-option nzValue="mug" nzLabel="Mug"></nz-option>
              <nz-option nzValue="cap" nzLabel="Cap"></nz-option>
              <nz-option nzValue="poster" nzLabel="Poster"></nz-option>
            </nz-select>
          </div>

          <div>
            <label class="block text-sm mb-2">Color</label>
            <nz-select [(ngModel)]="color" class="w-full">
              <nz-option nzValue="red" nzLabel="Red"></nz-option>
              <nz-option nzValue="blue" nzLabel="Blue"></nz-option>
              <nz-option nzValue="green" nzLabel="Green"></nz-option>
              <nz-option nzValue="black" nzLabel="Black"></nz-option>
              <nz-option nzValue="white" nzLabel="White"></nz-option>
            </nz-select>
          </div>

          <div>
            <label class="block text-sm mb-2">Size</label>
            <nz-select [(ngModel)]="size" class="w-full">
              <nz-option nzValue="xs" nzLabel="Extra Small"></nz-option>
              <nz-option nzValue="s" nzLabel="Small"></nz-option>
              <nz-option nzValue="m" nzLabel="Medium"></nz-option>
              <nz-option nzValue="l" nzLabel="Large"></nz-option>
              <nz-option nzValue="xl" nzLabel="Extra Large"></nz-option>
            </nz-select>
          </div>

          <div>
            <label class="block text-sm mb-2">Rotation</label>
            <nz-slider
              [(ngModel)]="rotation"
              [nzMin]="0"
              [nzMax]="360"
              (ngModelChange)="onRotationChange($event)">
            </nz-slider>
          </div>

          <div>
            <label class="block text-sm mb-2">Scale</label>
            <nz-slider
              [(ngModel)]="scale"
              [nzMin]="50"
              [nzMax]="150"
              [nzStep]="10">
            </nz-slider>
          </div>

          <div>
            <label class="block text-sm mb-2">Opacity</label>
            <nz-slider
              [(ngModel)]="opacity"
              [nzMin]="0"
              [nzMax]="100">
            </nz-slider>
          </div>

          <div class="space-y-2">
            <button nz-button nzType="primary" 
                    (click)="addLogo.emit()" 
                    class="w-full">
              Add Logo
            </button>
            <button nz-button nzType="default" 
                    (click)="addShape.emit()" 
                    class="w-full">
              Add Shape
            </button>
            <button nz-button nzType="default" 
                    class="w-full">
              Add Text
            </button>
            <nz-upload 
              [nzBeforeUpload]="beforeUpload"
              nzAction="/" 
              [nzShowUploadList]="false">
              <button nz-button class="w-full">
                Upload Image
              </button>
            </nz-upload>
          </div>
        </div>
      </div>
    `
  })
  export class DesignControlsComponent {
    @Input() productType: string = 'shirt';
    @Output() productTypeChange = new EventEmitter<string>();
    @Output() addLogo = new EventEmitter<void>();
    @Output() addShape = new EventEmitter<void>();
    @Output() uploadImage = new EventEmitter<File>();
    @Output() rotationChange = new EventEmitter<number>();

    rotation: number = 0;
    scale: number = 100;
    opacity: number = 100;
    color: string = 'white';
    size: string = 'm';

    onProductTypeChange(type: string) {
      this.productTypeChange.emit(type);
    }

    onRotationChange(value: number) {
      this.rotationChange.emit(value);
    }

    beforeUpload = (file: NzUploadFile): boolean => {
      if (file instanceof File) {
        this.uploadImage.emit(file);
      } else if (file.originFileObj) {
        this.uploadImage.emit(file.originFileObj);
      }
      return false;
    };
  }