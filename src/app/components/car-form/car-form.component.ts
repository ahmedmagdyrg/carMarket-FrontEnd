import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CarService } from '../../services/car.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent implements OnInit {
  submitted = false;
  selectedFiles: File[] = [];
  isEdit = false;
  carId: string | null = null;

  currentYear = new Date().getFullYear();
  maxYear = this.currentYear + 1;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: CarService,
    private router: Router,
    private route: ActivatedRoute
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
      features: [''],
      description: [''],
      contactMethod: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.carId = this.route.snapshot.paramMap.get('id');
    if (this.carId) {
      this.isEdit = true;
      this.loadCar();
    }
  }

  async loadCar() {
    try {
      const car = await this.svc.getById(this.carId!);
      this.form.patchValue({
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        condition: car.condition,
        features: car.features ? car.features.join(', ') : '',
        description: car.description,
        contactMethod: car.contactMethod
      });
    } catch (err) {
      console.error('Failed to load car', err);
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  async save() {
    this.submitted = true;

    // 🔹 Check if user is logged in before saving
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Not Logged In',
        text: 'You must be logged in to save a listing!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    if (this.form.invalid) return;

    const value = this.form.value;
    const formData = new FormData();

    formData.append('make', value.make);
    formData.append('model', value.model);
    formData.append('year', value.year.toString());
    formData.append('price', value.price.toString());
    formData.append('mileage', value.mileage.toString());
    formData.append('condition', value.condition);
    formData.append('description', value.description || '');
    formData.append('contactMethod', value.contactMethod);

    (value.features ? value.features.split(',') : []).forEach((f: string) => {
      if (f.trim()) formData.append('features[]', f.trim());
    });

    if (!this.isEdit && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      let savedCar: any;

      if (this.isEdit) {
        // Update existing car
        savedCar = await this.svc.update(this.carId!, formData);
        // Navigate to car detail page after update
        this.router.navigate(['/cars', this.carId]);
      } else {
        // Create new car
        savedCar = await this.svc.create(formData);
        this.router.navigate(['/cars', savedCar._id]);
      }

    } catch (err) {
      console.error('Save failed', err);
    }
  }
}
