import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { Select2Module } from 'ng-select2-component';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropzoneComponent } from '../../../shared/components/ui/dropzone/dropzone';
import { NgxEditor as AppNgxEditor } from '../../../shared/components/ui/editor/ngx-editor';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    Select2Module,
    DropzoneComponent,
    AppNgxEditor
  ],
  templateUrl: './news-form.html',
  styleUrls: ['./news-form.scss']
})
export class NewsForm implements OnInit, OnDestroy {
  isEditMode = false;
  newsId: string | null = null;
  activeTab = 'editor'; // Tab activo por defecto
  newsForm!: FormGroup;

  editor!: Editor;
  editor2!: Editor;

  dropzoneConfig: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
    maxFiles: 10,
    acceptedFiles: 'image/*',
    clickable: true,
  };

  dropzoneMessage = `
    <i class="icon-cloud-up" style="font-size: 48px; color: var(--theme-default);"></i>
    <h6 style="margin-top: 1rem;">Drop files here or click to upload</h6>
    <span class="note needsclick" style="color: var(--bs-secondary);">(Select images for your news article)</span>
  `;

  blogType = [
    { id: '1', title: 'Text', checked: true },
    { id: '2', title: 'Image', checked: false },
    { id: '3', title: 'Audio', checked: false },
    { id: '4', title: 'Video', checked: false },
  ];

  addBlogCategory = [
    { value: '1', label: 'Lifestyle' },
    { value: '2', label: 'Travel' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.editor2 = new Editor();

    // Inicializar formulario reactivo
    this.initForm();

    // Detectar si es modo edición o creación
    this.newsId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.newsId;

    if (this.isEditMode) {
      this.loadNewsData(this.newsId);
    }
  }

  initForm(): void {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      content: ['', Validators.required],
      category: ['', Validators.required],
      images: [[]],
      pinned: [false],
      published: [false]
    });
  }

  // Helpers para contadores
  get titleLength(): number {
    return (this.newsForm.get('title')?.value || '').length;
  }
  get descriptionLength(): number {
    return (this.newsForm.get('description')?.value || '').length;
  }
  get contentTextLength(): number {
    const html: string = this.newsForm.get('content')?.value || '';
    // Remover etiquetas HTML para contar solo texto plano
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length;
  }

  loadNewsData(id: string | null): void {
    // TODO: Cargar datos de la noticia desde el backend
    console.log('Cargando noticia con ID:', id);
    // Ejemplo de cómo poblar el form:
    // this.newsForm.patchValue(newsData);
  }

  onSubmit(): void {
    if (this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      console.error('Formulario inválido');
      return;
    }

    const formData = this.newsForm.value;
    console.log('Datos del formulario:', formData);

    if (this.isEditMode) {
      // TODO: Actualizar noticia existente
      console.log('Actualizando noticia:', this.newsId, formData);
    } else {
      // TODO: Crear nueva noticia
      console.log('Creando nueva noticia:', formData);
    }

    // Ejemplo de navegación después del submit:
    // this.router.navigate(['/news']);
  }

  onCancel(): void {
    this.router.navigate(['/news']);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor2.destroy();
  }
}
