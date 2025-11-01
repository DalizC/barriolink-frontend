import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select2Module } from 'ng-select2-component';

@Component({
  selector: 'app-projects-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Select2Module],
  templateUrl: './projects-create.html',
  styleUrls: ['./projects-create.scss']
})
export class ProjectsCreateComponent implements OnInit {
  projectForm!: FormGroup;

  // Opciones para ng-select2-component
  projectTypeOptions = [
    { value: 'tipo1', label: 'Tipo 1' },
    { value: 'tipo2', label: 'Tipo 2' }
  ];
  projectCategoryOptions = [
    { value: 'cat1', label: 'Cat 1' },
    { value: 'cat2', label: 'Cat 2' }
  ];
  projectPriorityOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' }
  ];
  teamLeaderOptions = [
    { value: 'leader1', label: 'Leader 1' },
    { value: 'leader2', label: 'Leader 2' }
  ];
  teamMemberOptions = [
    { value: 'member1', label: 'Member 1' },
    { value: 'member2', label: 'Member 2' },
    { value: 'member3', label: 'Member 3' }
  ];
  projectSizeOptions = [
    { value: 'small', label: 'Pequeño' },
    { value: 'medium', label: 'Mediano' },
    { value: 'large', label: 'Grande' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      projectType: ['', [Validators.required]],
      category: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      teamLeader: ['', [Validators.required]],
      teamMember: ['', [Validators.required]],
      size: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      details: ['', [Validators.required]],
      document: ['', [Validators.required]]
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