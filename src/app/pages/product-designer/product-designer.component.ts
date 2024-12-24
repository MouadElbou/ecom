import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignCanvasComponent } from '../../components/design-canvas/design-canvas.component';
import { DesignControlsComponent } from '../../components/design-controls/design-controls.component';

@Component({
  selector: 'app-product-designer',
  standalone: true,
  imports: [
    CommonModule,
    DesignCanvasComponent,
    DesignControlsComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <app-design-controls
          [productType]="productType"
          (productTypeChange)="onProductTypeChange($event)"
          (addLogo)="onAddLogo()"
          (addShape)="onAddShape()"
          (uploadImage)="onUploadImage($event)"
          (rotationChange)="onRotationChange($event)">
        </app-design-controls>
        
        <div class="md:col-span-2 relative bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[600px]">
          <app-design-canvas
            #canvas
            [width]="800"
            [height]="600"
            [productType]="productType"
            style="z-index: 20">
          </app-design-canvas>
          
          <div class="absolute inset-0 flex items-center justify-center">
            <img 
              src="/assets/images/tshirt-template.png" 
              alt="T-Shirt Template" 
              class="max-w-[400px] h-auto opacity-50 pointer-events-none"
            >
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDesignerComponent {
  @ViewChild('canvas') canvas!: DesignCanvasComponent;
  productType: string = 'shirt';

  onProductTypeChange(type: string) {
    this.productType = type;
  }

  onAddLogo() {
    this.canvas.addLogo();
  }

  onAddShape() {
    this.canvas.addShape();
  }

  onUploadImage(file: File) {
    this.canvas.addImage(file);
  }

  onRotationChange(angle: number) {
    this.canvas.rotateSelectedElement(angle);
  }
}