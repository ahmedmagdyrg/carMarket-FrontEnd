import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  banned?: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('buttonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.85)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  stats: any = null;
  loading = false;
  searchTerm = '';
  darkMode = false;

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await Promise.all([this.loadUsers(), this.loadStats()]);
    this.applyFilter();
    this.loading = false;

    // Optional: remember dark mode from localStorage
    const savedMode = localStorage.getItem('darkMode');
    this.darkMode = savedMode === 'true';
  }

  async loadUsers(): Promise<void> {
    try {
      this.users = await this.userService.getAllUsers();
      this.applyFilter();
    } catch (error: any) {
      Swal.fire('Error', 'Failed to load users.', 'error');
    }
  }

  async loadStats(): Promise<void> {
    try {
      this.stats = await this.userService.getDashboardStats();
    } catch (error: any) {
      Swal.fire('Error', 'Failed to load stats.', 'error');
    }
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      (user.name?.toLowerCase().includes(term) || user.email.toLowerCase().includes(term))
    );
  }

  async toggleBan(user: User): Promise<void> {
    const action = user.banned ? 'unbanUser' : 'banUser';
    const actionText = user.banned ? 'Unbanned' : 'Banned';

    try {
      if (user.banned) {
        await this.userService.unbanUser(user._id);
      } else {
        await this.userService.banUser(user._id);
      }
      user.banned = !user.banned;

      await Swal.fire({
        icon: 'success',
        title: `${actionText} successfully`,
        text: `User ${user.name} has been ${actionText.toLowerCase()}.`,
        timer: 2000,
        showConfirmButton: false,
      });
      this.applyFilter();
    } catch (error: any) {
      Swal.fire('Error', `Failed to ${action} the user.`, 'error');
    }
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
  }
}
