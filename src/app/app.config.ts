import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ShoppingCartOutline, DeleteOutline, LockOutline, CreditCardOutline, SearchOutline } from '@ant-design/icons-angular/icons';

const icons = [
  ShoppingCartOutline,
  DeleteOutline,
  LockOutline,
  CreditCardOutline,
  SearchOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: NzIconModule,
      useValue: icons
    }
  ]
};