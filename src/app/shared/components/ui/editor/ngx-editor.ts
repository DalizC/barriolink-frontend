import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-ngx-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule],
  templateUrl: './ngx-editor.html',
  styleUrl: './ngx-editor.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxEditor),
      multi: true,
    },
  ],
})
export class NgxEditor implements ControlValueAccessor {
  public editor!: Editor;
  @Input() placeholder: string = 'Escribe aquí...';
  disabled = false;

  // Valor interno vinculado al editor
  value: string = '';

  // CVA callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // ControlValueAccessor
  writeValue(value: string | null): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Vincular cambios del editor
  onModelChange(val: string): void {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
