import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-projects-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projects-create.html',
  styleUrl: './projects-create.scss'
})
export class ProjectsCreateComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required]],
      clientName: ['', [Validators.required]], 
      projectProgress: [0, [Validators.required]],
      projectType: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      projectSize: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      enterSomeDetails: ['', [Validators.required]],
      uploadProjectFile: ['']
    });
  }

  submitForm() {
    if (this.projectForm.valid) {
      console.log('Form submitted:', this.projectForm.value);
      // Aquí puedes agregar la lógica para enviar los datos
    } else {
      console.log('Form is invalid');
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
    }
  }
}