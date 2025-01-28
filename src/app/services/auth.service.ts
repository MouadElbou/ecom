import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  private readonly USER_KEY = 'user_data';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check for existing session
    this.loadUserFromStorage();
  }

  async login(credentials: { email: string; password: string }): Promise<void> {
    // Replace with your actual API endpoint
    const response = await this.http.post<{user: User; token: string}>(
      '/api/auth/login', 
      credentials
    ).toPromise();

    if (response) {
      this.setSession(response.user, response.token);
      this.currentUser.next(response.user);
    }
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'CLIENT' | 'SUPPLIER'
  }): Promise<void> {
    // Replace with your actual API endpoint
    const response = await this.http.post<{user: User; token: string}>(
      '/api/auth/register', 
      userData
    ).toPromise();

    if (response) {
      this.setSession(response.user, response.token);
      this.currentUser.next(response.user);
    }
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUserRole(): 'CLIENT' | 'SUPPLIER' | null {
    return this.currentUser.value?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser.value;
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(user: User, token: string): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      this.currentUser.next(JSON.parse(userData));
    }
  }
}