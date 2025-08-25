import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';  

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent implements OnInit {
  car = signal<any | null>(null);
  currentIndex = 0;
  showContact = false;

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
  }

  nextImage() {
    if (this.car()?.images?.length) {
      this.currentIndex = (this.currentIndex + 1) % this.car().images.length;
    }
  }

  prevImage() {
    if (this.car()?.images?.length) {
      this.currentIndex =
        (this.currentIndex - 1 + this.car().images.length) % this.car().images.length;
    }
  }

  isOwner(): boolean {
    const currentUser = this.auth.currentUser;
    return !!(currentUser && this.car() && this.car().userId === currentUser.id);
  }

  async deleteCar() {
    if (!this.car()) return;

    //  SweetAlert2 popup
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
      await this.svc.remove(this.car().id);

      //  Success message
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
