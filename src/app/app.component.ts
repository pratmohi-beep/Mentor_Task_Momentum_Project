import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import '@momentum-design/components/dist/components/toggle/index.js';
import '@momentum-design/components/dist/components/themeprovider/index.js';

const STORAGE_KEY = 'momentum-profile-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d\s().-]{7,20}$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: [''],
  });

  readonly steps = ['Personal details', 'Address', 'Review'];
  step = 0;
  darkTheme = false;
  submitted = false;

  ngOnInit(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.form.patchValue(JSON.parse(saved) as Partial<typeof this.form.value>);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    this.form.valueChanges.subscribe((value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)));
  }

  get progress(): number {
    return ((this.step + 1) / this.steps.length) * 100;
  }

  get currentHeading(): string {
    return this.steps[this.step];
  }

  toggleTheme(event: Event): void {
    this.darkTheme = Boolean((event.target as HTMLElement & { checked?: boolean }).checked);
  }

  next(): void {
    const controls = this.step === 0
      ? ['name', 'email', 'phone'] as const
      : ['address', 'city'] as const;
    controls.forEach((name) => this.form.controls[name].markAsTouched());
    if (controls.some((name) => this.form.controls[name].invalid)) return;
    this.step = Math.min(this.step + 1, 2);
  }

  previous(): void {
    this.step = Math.max(this.step - 1, 0);
  }

  submit(): void {
    if (this.form.invalid) {
      this.step = this.form.controls.address.invalid || this.form.controls.city.invalid ? 1 : 0;
      this.form.markAllAsTouched();
      return;
    }
    this.submitted = true;
    localStorage.removeItem(STORAGE_KEY);
  }

  restart(): void {
    this.form.reset();
    this.step = 0;
    this.submitted = false;
    localStorage.removeItem(STORAGE_KEY);
  }

  hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }
}
