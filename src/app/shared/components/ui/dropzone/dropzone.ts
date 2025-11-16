import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [CommonModule, DropzoneModule],
  templateUrl: './dropzone.html',
  styleUrls: ['./dropzone.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropzoneComponent),
      multi: true
    }
  ]
})
export class DropzoneComponent implements ControlValueAccessor {
  @Input() config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    addRemoveLinks: true,
    maxFiles: 10,
    acceptedFiles: 'image/*',
  };

  @Input() message = `

      <i class="icon-cloud-up"></i>
      <h6>Drop files here or click to upload.</h6>
      <span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span>

  `;

  files: File[] = [];
  disabled = false;

  // ControlValueAccessor callbacks
  private onChange: (value: File[]) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor methods
  writeValue(value: File[] | null): void {
    this.files = value || [];
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Dropzone events
  onAddedFile(event: any): void {
    if (event) {
      this.files.push(event);
      this.onChange(this.files);
      this.onTouched();
    }
  }

  onRemovedFile(event: any): void {
    const index = this.files.findIndex(f => f === event);
    if (index > -1) {
      this.files.splice(index, 1);
      this.onChange(this.files);
    }
  }

  onError(event: any): void {
    console.error('Dropzone error:', event);
  }
}
