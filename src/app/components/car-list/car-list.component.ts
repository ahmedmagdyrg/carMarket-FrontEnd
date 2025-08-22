import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarService } from '../../services/car.service';
import { FormsModule } from '@angular/forms';
import { CarCardComponent } from '../car-card/car-card.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CarCardComponent],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  loading = signal<boolean>(true);
  cars = signal<any[]>([]);
  q = signal<string>('');
  maxPrice = signal<number | null>(null);
  condition = signal<string>('All');
  sortBy = signal<'newest' | 'price-asc' | 'price-desc'>('newest');

  filtered = computed(() => {
    let list = [...this.cars()];
    const term = this.q().trim().toLowerCase();
    if (term) {
      list = list.filter(c =>
        [c.make, c.model, String(c.year)]
          .join(' ')
          .toLowerCase()
          .includes(term)
      );
    }
    const price = this.maxPrice();
    if (price != null) list = list.filter(c => c.price <= price);
    if (this.condition() !== 'All') list = list.filter(c => c.condition === this.condition());
    switch (this.sortBy()) {
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      default: list.sort((a,b)=>b.year-a.year);
    }
    return list;
  });

  constructor(private carSvc: CarService, private router: Router) {}

  async ngOnInit() {
    this.loading.set(true);
    this.cars.set(await this.carSvc.getAll());
    this.loading.set(false);
  }

  open(id: string) {
    this.router.navigate(['/cars', id]);
  }

  clearFilters() {
    this.q.set('');
    this.maxPrice.set(null);
    this.condition.set('All');
    this.sortBy.set('newest');
  }

  trackByCar(index: number, car: any) {
    return car.id;
  }
}
