import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { Select2Module } from 'ng-select2-component';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [
    CommonModule,
    NgxEditorModule,
    Select2Module,
    DropzoneModule
  ],
  templateUrl: './news-create.html',
  styleUrl: './news-create.scss'
})
export class NewsForm implements OnInit, OnDestroy {
  isEditMode = false;
  newsId: string | null = null;

  editor!: Editor;
  editor2!: Editor;
  text = `<div class="dz-message needsclick"> <i class="icon-cloud-up"></i> <h6>Drop files here or click to upload.</h6> <span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span> </div>`;

  Config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
  };

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.editor2 = new Editor();

    // Detectar si es modo edición o creación
    this.newsId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.newsId;

    if (this.isEditMode) {
      this.loadNewsData(this.newsId);
    }
  }

  loadNewsData(id: string | null): void {
    // TODO: Cargar datos de la noticia desde el backend
    console.log('Cargando noticia con ID:', id);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor2.destroy();
  }
}
