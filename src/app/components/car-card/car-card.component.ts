import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.scss'],
})
export class CarCardComponent {
  @Input() car: any;
  @Output() view = new EventEmitter<string>();

  currentIndex = 0;

  get originals(): string[] {
    return this.car?.images?.originals?.length
      ? this.car.images.originals
      : [this.car.imageUrl];
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.originals.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.originals.length) % this.originals.length;
  }
}
