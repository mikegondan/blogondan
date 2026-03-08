import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, authState, User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private auth = inject(Auth);

  // Observable and Signal for currently authenticated user
  user$ = authState(this.auth);
  isDropdownOpen = signal(false);

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.isDropdownOpen.set(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.update(val => !val);
  }
}
