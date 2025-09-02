import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CarDetailComponent implements OnInit, OnDestroy {
  car = signal<any | null>(null);
  currentIndex = 0;
  showContact = false;
  private intervalId?: any;

  constructor(
    private route: ActivatedRoute,
    private svc: CarService,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigateByUrl('/');
      return;
    }

    const found = await this.svc.getById(id);
    if (!found) {
      this.router.navigateByUrl('/');
      return;
    }
    this.car.set(found);
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  nextImage() {
    const imgs = this.car()?.images?.resized || [];
    if (imgs.length) {
      this.currentIndex = (this.currentIndex + 1) % imgs.length;
    }
  }

  prevImage() {
    const imgs = this.car()?.images?.resized || [];
    if (imgs.length) {
      this.currentIndex = (this.currentIndex - 1 + imgs.length) % imgs.length;
    }
  }

  startAutoSlide() {
    const imgs = this.car()?.images?.resized || [];
    if (imgs.length > 1) {
      this.intervalId = setInterval(() => this.nextImage(), 4000);
    }
  }

  isOwner(): boolean {
    const currentUser = this.auth.currentUser;
    const car = this.car();
    if (!currentUser || !car) return false;

    const carOwnerId = car.userId?._id || car.ownerId?._id || car.userId || car.ownerId;
    const currentUserId = currentUser.id || currentUser._id;

    return String(carOwnerId) === String(currentUserId);
  }

  isAdmin(): boolean {
    const currentUser = this.auth.currentUser;
    return !!(currentUser && currentUser.role === 'admin');
  }

  canDelete(): boolean {
    return this.isOwner() || this.isAdmin();
  }

  async deleteCar() {
    if (!this.car() || !this.canDelete()) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      cancelButtonColor: '#6C757D',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await this.svc.remove(this.car()!.id);

      await Swal.fire({
        title: 'Deleted!',
        text: 'The car has been removed.',
        icon: 'success',
        confirmButtonColor: '#1DA1F2'
      });

      this.router.navigateByUrl('/cars');
    }
  }
}
