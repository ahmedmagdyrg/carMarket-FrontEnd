import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent {
  submitted = false;

  currentYear = new Date().getFullYear();
  maxYear = this.currentYear + 1;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: CarService,
    private router: Router
  ) {
    this.form = this.fb.group({
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: [
        this.currentYear,
        [Validators.required, Validators.min(1980), Validators.max(this.maxYear)]
      ],
      price: [10000, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      condition: ['Used', [Validators.required]],
      features: ['Bluetooth, Backup Camera'],
      description: ['Clean and well maintained.'],
      imageUrl: ['assets/images/cars/placeholder.jpg', [Validators.required]],
    });
  }

  async save() {
    this.submitted = true;
    if (this.form.invalid) return;

    const value = this.form.value;
    await this.svc.create({
      make: value.make as string,
      model: value.model as string,
      year: value.year as number,
      price: value.price as number,
      mileage: value.mileage as number,
      condition: value.condition as 'New' | 'Used' | 'Certified',
      features: value.features
        ? (value.features as string).split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      description: value.description || '',
      imageUrl: value.imageUrl as string,
    });

    this.router.navigateByUrl('/');
  }
}
