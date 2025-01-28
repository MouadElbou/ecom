import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../services/auth.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTabsModule,
    NzSelectModule,
    NzMessageModule,
    NzIconModule,
    NzCheckboxModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <!-- Left Side - Brand Info -->
      <div class="hidden lg:flex lg:w-1/2 flex-col items-center justify-center text-white p-8">
        <div class="max-w-md text-center">
          <h1 class="text-5xl font-bold mb-6">MarketHub</h1>
          <p class="text-xl mb-8">Connect with suppliers and customers in one powerful platform</p>
          <div class="grid grid-cols-3 gap-6 text-center">
            <div class="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <span nz-icon nzType="shop" class="text-3xl mb-2"></span>
              <p class="text-sm">Multiple Suppliers</p>
            </div>
            <div class="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <span nz-icon nzType="safety" class="text-3xl mb-2"></span>
              <p class="text-sm">Secure Platform</p>
            </div>
            <div class="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <span nz-icon nzType="dollar" class="text-3xl mb-2"></span>
              <p class="text-sm">Best Deals</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Auth Forms -->
      <div class="w-full max-w-md lg:w-1/2 lg:max-w-lg">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p class="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <nz-tabset [nzAnimated]="false" class="auth-tabs" [(nzSelectedIndex)]="activeTabIndex">
            <!-- Login Tab -->
            <nz-tab nzTitle="Login">
              <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-6">
                <div class="relative">
                  <span nz-icon nzType="mail" class="absolute left-3 top-3 text-gray-400"></span>
                  <input nz-input formControlName="email" type="email"
                          class="pl-10 rounded-lg" placeholder="Email address"/>
                  <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid"
                        class="text-red-500 text-sm mt-1">
                    Please enter a valid email
                  </div>
                </div>

                <div class="relative">
                  <span nz-icon nzType="lock" class="absolute left-3 top-3 text-gray-400"></span>
                  <input nz-input formControlName="password" type="password"
                          class="pl-10 rounded-lg" placeholder="Password"/>
                  <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"
                        class="text-red-500 text-sm mt-1">
                    Password must be at least 6 characters
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <label nz-checkbox>Remember me</label>
                  <a class="text-blue-600 hover:text-blue-800">Forgot password?</a>
                </div>

                <button nz-button nzType="primary" [nzLoading]="isLoading"
                         class="w-full h-12 text-lg rounded-lg">
                  Sign In
                </button>
              </form>
            </nz-tab>

            <!-- Register Tab -->
            <nz-tab nzTitle="Register">
              <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-6">
                <div class="relative">
                  <span nz-icon nzType="user" class="absolute left-3 top-3 text-gray-400"></span>
                  <input nz-input formControlName="name"
                          class="pl-10 rounded-lg" placeholder="Full name"/>
                </div>

                <div class="relative">
                  <span nz-icon nzType="mail" class="absolute left-3 top-3 text-gray-400"></span>
                  <input nz-input formControlName="email" type="email"
                          class="pl-10 rounded-lg" placeholder="Email address"/>
                </div>

                <div class="relative">
                  <span nz-icon nzType="lock" class="absolute left-3 top-3 text-gray-400"></span>
                  <input nz-input formControlName="password" type="password"
                          class="pl-10 rounded-lg" placeholder="Choose password"/>
                </div>

                <div class="relative">
                  <span nz-icon nzType="team" class="absolute left-3 top-3 text-gray-400"></span>
                  <nz-select formControlName="role" class="w-full rounded-lg">
                    <nz-option nzValue="CLIENT" nzLabel="Join as Client"></nz-option>
                    <nz-option nzValue="SUPPLIER" nzLabel="Join as Supplier"></nz-option>
                  </nz-select>
                </div>

                <button nz-button nzType="primary" [nzLoading]="isLoading"
                         class="w-full h-12 text-lg rounded-lg">
                  Create Account
                </button>
              </form>
            </nz-tab>
          </nz-tabset>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .auth-tabs .ant-tabs-nav::before {
        border-bottom: none;
      }
      .ant-tabs-tab {
        @apply text-lg px-8;
      }
      .ant-input {
        @apply h-12;
      }
      .ant-select-selector {
        @apply h-12 flex items-center;
      }
    }
  `]
})
export class AuthComponent {
  isLoading = false;
  activeTabIndex = 0;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly message: NzMessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CLIENT', Validators.required]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        await this.authService.login(this.loginForm.value);
        const role = this.authService.getCurrentUserRole();
        if (role) {
          this.router.navigate([role.toLowerCase() + '/dashboard']);
        } else {
          this.message.error('User role not found');
        }
      } catch (error) {
        this.message.error('Invalid credentials');
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      try {
        // Extract form values
        const registerData = {
          name: this.registerForm.get('name')?.value,
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value,
          role: this.registerForm.get('role')?.value
        };

        // Call auth service with proper error handling
        const result = await this.authService.register(registerData);

        // Clear form after successful registration
        this.registerForm.reset();

        // Show success message and switch to login tab
        this.message.success('Registration successful! Please login.');
        this.activeTabIndex = 0; // Switch to login tab

      } catch (error: any) {
        // Handle specific error cases
        if (error.status === 409) {
          this.message.error('Email already exists');
        } else if (error.status === 400) {
          this.message.error('Invalid registration data');
        } else {
          this.message.error('Registration failed: ' + error.message);
        }
      } finally {
        this.isLoading = false;
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}