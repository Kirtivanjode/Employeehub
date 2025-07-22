import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isAuthenticated = false;
  isAdmin = false;
  currentUser: User | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.getAuthState().subscribe((authState) => {
      this.isAuthenticated = authState.isAuthenticated;
      this.currentUser = authState.user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
