import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignControlsComponent } from './design-controls.component';

describe('DesignControlsComponent', () => {
  let component: DesignControlsComponent;
  let fixture: ComponentFixture<DesignControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
