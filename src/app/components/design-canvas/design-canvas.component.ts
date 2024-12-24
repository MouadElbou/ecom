import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import paper from 'paper';

/**
 * Component for handling canvas-based design operations
 * Allows users to add, manipulate and customize design elements
 */
@Component({
  selector: 'app-design-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas [attr.width]="width" [attr.height]="height" 
            class="border border-gray-200 rounded-lg shadow-sm">
    </canvas>
  `
})
export class DesignCanvasComponent implements AfterViewInit {
  // Canvas reference and basic dimensions
  @ViewChild('canvas') canvasRef!: ElementRef;
  @Input() width = 800;
  @Input() height = 600;
  @Input() productType: string = 'shirt';

  // Paper.js related properties
  private project!: paper.Project;
  private border!: paper.Path;
  selectedElement: paper.Item | null = null;

  /**
   * Initialize canvas after view initialization
   * Sets up click handlers for canvas interaction
   */
  ngAfterViewInit() {
    this.initializeCanvas();

    // Handle canvas clicks for element selection/deselection
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('click', (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const point = new paper.Point(
        event.clientX - rect.left,
        event.clientY - rect.top
      );

      const hitResult = paper.project.hitTest(point);
      if (!hitResult) {
        if (this.selectedElement) {
          const group = this.selectedElement.parent as paper.Group;
          group.children.slice(1).forEach(handle => handle.visible = false);
          this.selectedElement = null;
        }
      }
    });
  }

  /**
   * Initialize Paper.js canvas and create border
   */
  private initializeCanvas() {
    paper.setup(this.canvasRef.nativeElement);
    this.project = paper.project;
    this.createBorder();
  }

  /**
   * Creates or updates the border based on product dimensions
   */
  private createBorder() {
    if (this.border) {
      this.border.remove();
    }

    const dimensions = this.getProductDimensions();
    this.border = new paper.Path.Rectangle({
      center: new paper.Point(this.width / 2, this.height / 2),
      size: new paper.Size(dimensions.width, dimensions.height),
      strokeColor: 'black',
      strokeWidth: 2
    });
  }

  /**
   * Returns dimensions based on product type
   */
  private getProductDimensions() {
    switch (this.productType) {
      case 'shirt':
        return { width: this.width * 0.25, height: this.height * 0.5 };
      case 'pen':
        return { width: this.width * 0.2, height: this.height * 0.8 };
      default:
        return { width: this.width * 0.4, height: this.height * 0.5 };
    }
  }

  /**
   * Adds a circular logo to the canvas
   */
  addLogo() {
    const logo = new paper.Path.Circle({
      center: this.getDefaultPosition(),
      radius: 30,
      fillColor: 'blue'
    });
    this.makeElementDraggable(logo);
  }

  /**
   * Adds a hexagonal shape to the canvas
   */
  addShape() {
    const shape = new paper.Path.RegularPolygon({
      center: this.getDefaultPosition(),
      sides: 6,
      radius: 25,
      fillColor: 'red'
    });
    this.makeElementDraggable(shape);
  }

  /**
   * Adds an image to the canvas and scales it appropriately
   */
  addImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const raster = new paper.Raster({
        source: e.target?.result as string,
        position: this.getDefaultPosition()
      });

      raster.onLoad = () => {
        // Calculate appropriate scaling
        const borderBounds = this.border.bounds;
        const borderWidth = borderBounds.width;
        const borderHeight = borderBounds.height;
        const scaleWidth = borderWidth / raster.bounds.width;
        const scaleHeight = borderHeight / raster.bounds.height;
        const scaleFactor = Math.min(scaleWidth, scaleHeight, 1) * 0.8;

        raster.scale(scaleFactor);
        this.makeElementDraggable(raster);

        const group = raster.parent as paper.Group;
        if (group) {
          this.updateControls(group);
          group.children.slice(1).forEach(handle => handle.visible = true);
        }
      };
    };
    reader.readAsDataURL(file);
  }

  /**
   * Returns the center point of the canvas
   */
  private getDefaultPosition(): paper.Point {
    return new paper.Point(this.width / 2, this.height / 2);
  }

  /**
   * Makes an element draggable and adds control handles
   */
  private makeElementDraggable(element: paper.Item) {
    const group = this.addControlsToElement(element);

    // Selection handler
    element.onMouseDown = () => {
      this.selectedElement = element;
      group.children.slice(1).forEach(handle => handle.visible = true);
    };

    // Drag handler with boundary checking
    element.onMouseDrag = (event: paper.MouseEvent) => {
      const group = element.parent as paper.Group;
      const newPosition = group.position.add(event.delta);
      const elementBounds = group.bounds;
    
      if (this.border.bounds.contains(elementBounds)) {
        group.position = newPosition;
      } else {
        const borderBounds = this.border.bounds;
        const newBounds = elementBounds.clone();
        newBounds.x += event.delta.x;
        newBounds.y += event.delta.y;
      
        if (newBounds.left >= borderBounds.left && 
            newBounds.right <= borderBounds.right && 
            newBounds.top >= borderBounds.top && 
            newBounds.bottom <= borderBounds.bottom) {
          group.position = newPosition;
        }
      }
    };

    // Scale handle drag handler
    const scaleHandle = group.children[group.children.length - 1];
    scaleHandle.onMouseDrag = (event: paper.MouseEvent) => {
      const element = group.children[0];
      const originalBounds = element.bounds.clone();
      const oppositeCorner = originalBounds.topLeft;
      const newWidth = Math.abs(event.point.x - oppositeCorner.x);
      const newHeight = Math.abs(event.point.y - oppositeCorner.y);
      const aspectRatio = originalBounds.width / originalBounds.height;

      const newBounds = new paper.Rectangle({
        topLeft: oppositeCorner,
        size: new paper.Size(newWidth, newWidth / aspectRatio)
      });

      if (newWidth > 10 && newHeight > 10 && this.border.bounds.contains(newBounds)) {
        element.bounds = newBounds;
        this.updateControls(group);
      }
    };

    // Canvas click handler for deselection
    paper.view.onClick = (event: paper.MouseEvent) => {
      if (!event.target) {
        if (this.selectedElement) {
          const group = this.selectedElement.parent as paper.Group;
          group.children.slice(1).forEach(handle => handle.visible = false);
        }
        this.selectedElement = null;
      }
    };

    group.children.slice(1).forEach(handle => handle.visible = false);
  }

  /**
   * Adds control handles (delete and scale) to an element
   */
  private addControlsToElement(element: paper.Item) {
    const group = new paper.Group([element]);
    const bounds = element.bounds;

    // Create delete button
    const deleteButton = new paper.Group();
    const circle = new paper.Path.Circle({
      center: bounds.topLeft,
      radius: 8,
      fillColor: 'red',
      strokeColor: 'white',
      strokeWidth: 1
    });

    const xPath = new paper.Path({
      segments: [
        [bounds.topLeft.x - 4, bounds.topLeft.y - 4],
        [bounds.topLeft.x + 4, bounds.topLeft.y + 4],
        [bounds.topLeft.x, bounds.topLeft.y],
        [bounds.topLeft.x - 4, bounds.topLeft.y + 4],
        [bounds.topLeft.x + 4, bounds.topLeft.y - 4]
      ],
      strokeColor: 'white',
      strokeWidth: 1.5,
      strokeCap: 'round'
    });

    deleteButton.addChildren([circle, xPath]);

    // Create scale handle
    const scaleHandle = new paper.Group();
    const scaleCircle = new paper.Path.Circle({
      center: bounds.bottomRight,
      radius: 8,
      fillColor: 'white',
      strokeColor: 'blue',
      strokeWidth: 1
    });

    const arrowPath = new paper.Path({
      segments: [
        [bounds.bottomRight.x - 6, bounds.bottomRight.y],
        [bounds.bottomRight.x - 2, bounds.bottomRight.y - 4],
        [bounds.bottomRight.x - 2, bounds.bottomRight.y + 4],
        [bounds.bottomRight.x - 6, bounds.bottomRight.y],
        [bounds.bottomRight.x + 6, bounds.bottomRight.y],
        [bounds.bottomRight.x + 2, bounds.bottomRight.y - 4],
        [bounds.bottomRight.x + 2, bounds.bottomRight.y + 4],
        [bounds.bottomRight.x + 6, bounds.bottomRight.y]
      ],
      fillColor: 'blue',
      closed: true
    });

    scaleHandle.addChildren([scaleCircle, arrowPath]);

    // Handle events
    deleteButton.onMouseDown = () => {
      group.remove();
      this.selectedElement = null;
    };

    scaleHandle.onMouseDrag = (event: paper.MouseEvent) => {
      const element = group.children[0];
      const originalBounds = element.bounds.clone();
      const oppositeCorner = originalBounds.topLeft;
      const newWidth = Math.abs(event.point.x - oppositeCorner.x);
      const newHeight = Math.abs(event.point.y - oppositeCorner.y);
      const aspectRatio = originalBounds.width / originalBounds.height;

      const newBounds = new paper.Rectangle({
        topLeft: oppositeCorner,
        size: new paper.Size(newWidth, newWidth / aspectRatio)
      });

      if (newWidth > 10 && newHeight > 10 && this.border.bounds.contains(newBounds)) {
        element.bounds = newBounds;
        this.updateControls(group);
      }
    };

    group.addChildren([scaleHandle, deleteButton]);
    return group;
  }

  /**
   * Updates the position of control handles when element is transformed
   */
  private updateControls(group: paper.Group) {
    const element = group.children[0];
    const scaleHandle = group.children[1];
    const deleteButton = group.children[2];
    const xSymbol = group.children[3];

    const bounds = element.bounds;
    scaleHandle.position = bounds.bottomRight;
    deleteButton.position = bounds.topLeft;
    xSymbol.position = bounds.topLeft;
  }

  /**
   * Rotates the selected element by specified angle
   */
  rotateSelectedElement(angle: number) {
    if (this.selectedElement) {
      this.selectedElement.rotation = angle;
      this.project.view.update();
    }
  }
}