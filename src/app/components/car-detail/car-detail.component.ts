import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent implements OnInit {
  car = signal<any | null>(null);

  constructor(private route: ActivatedRoute, private svc: CarService, private router: Router) {}

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
}
