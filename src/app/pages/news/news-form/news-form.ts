import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { Select2Module } from 'ng-select2-component';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropzoneComponent } from '../../../shared/components/ui/dropzone/dropzone';
import { NgxEditor as AppNgxEditor } from '../../../shared/components/ui/editor/ngx-editor';
import { NewsService, NewsCreate } from '../../../core/services/news.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

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
  activeTab = 'editor';
  newsForm!: FormGroup;

  editor!: Editor;
  editor2!: Editor;

  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private newsService: NewsService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.editor2 = new Editor();

    // Inicializar formulario reactivo
    this.initForm();

    // Cargar categorías desde el backend
    this.loadCategories();

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
      summary: ['', [Validators.required, Validators.maxLength(300)]],
      content: ['', Validators.required],
      link: [''],
      categories: [[], Validators.required],
      images: [[]],
      pinned: [false],
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías';
      }
    });
  }

  // Helpers para contadores
  get titleLength(): number {
    return (this.newsForm.get('title')?.value || '').length;
  }
  get summaryLength(): number {
    return (this.newsForm.get('summary')?.value || '').length;
  }
  get contentTextLength(): number {
    const html: string = this.newsForm.get('content')?.value || '';
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length;
  }

  loadNewsData(id: string | null): void {
    if (!id) return;

    this.loading = true;
    this.newsService.getNewsById(+id).subscribe({
      next: (news) => {
        this.newsForm.patchValue({
          title: news.title,
          summary: news.summary,
          content: news.content,
          link: news.link || '',
          categories: news.categories || [],
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar noticia:', err);
        this.error = 'No se pudo cargar la noticia';
        this.loading = false;
      }
    });
  }

  onSubmit(action: 'draft' | 'publish' = 'draft'): void {
    if (this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const formValue = this.newsForm.value;
    const newsData: NewsCreate = {
      title: formValue.title,
      content: formValue.content,
      summary: formValue.summary,
      link: formValue.link || '',
      categories: formValue.categories,
      status: action === 'publish' ? 'published' : 'draft',
    };

    if (this.isEditMode && this.newsId) {
      // Actualizar noticia existente
      this.newsService.updateNews(+this.newsId, newsData).subscribe({
        next: (news) => {
          this.successMessage = 'Noticia actualizada exitosamente';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/news', news.id]), 1500);
        },
        error: (err) => {
          console.error('Error al actualizar noticia:', err);
          this.error = err.error?.detail || 'Error al actualizar la noticia';
          this.loading = false;
        }
      });
    } else {
      // Crear nueva noticia
      this.newsService.createNews(newsData).subscribe({
        next: (news) => {
          this.successMessage = 'Noticia creada exitosamente';
          this.loading = false;

          // Si se publicó directamente, navegar al detalle
          if (action === 'publish') {
            setTimeout(() => this.router.navigate(['/news', news.id]), 1500);
          } else {
            // Si es borrador, navegar a "mis noticias"
            setTimeout(() => this.router.navigate(['/news/my-news']), 1500);
          }
        },
        error: (err) => {
          console.error('Error al crear noticia:', err);
          this.error = err.error?.detail || 'Error al crear la noticia';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/news']);
  }

  onCategoryChange(event: Event, categoryId: number): void {
    const checkbox = event.target as HTMLInputElement;
    const currentCategories = this.newsForm.get('categories')?.value || [];

    if (checkbox.checked) {
      // Agregar categoría si no existe
      if (!currentCategories.includes(categoryId)) {
        this.newsForm.patchValue({
          categories: [...currentCategories, categoryId]
        });
      }
    } else {
      // Remover categoría
      this.newsForm.patchValue({
        categories: currentCategories.filter((id: number) => id !== categoryId)
      });
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor2.destroy();
  }
}
