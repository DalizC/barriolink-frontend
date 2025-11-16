import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { ICardToggleOptions } from '../../../../interface/common';

@Component({
  selector: 'app-card-dropdown-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-dropdown-button.html',
  styleUrl: './card-dropdown-button.scss',
})
export class CardDropdownButton implements OnChanges {
  private static nextId = 0;
  private readonly instanceId = ++CardDropdownButton.nextId;

  // 'simple' o 'classic' (por defecto 'simple')
  @Input() dropdownType: 'simple' | 'classic' = 'simple';

  // Opciones del menú
  @Input() options: ICardToggleOptions[] = [];

  // Clases extra opcionales para el contenedor
  @Input() dropdownClass: string = '';

  // Estado interno
  isOpen = false;
  selectedItem = '';

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      const opts = this.options;
      if (opts && opts.length && !this.selectedItem) {
        this.selectedItem = opts[0].title ?? '';
      }
    }
  }

  // Se llama desde el template: (click)="toggleDropdown($event)"
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // evita que el HostListener cierre inmediatamente
    const next = !this.isOpen;
    this.isOpen = next;

    // Si se abre, avisar a otros dropdowns para que se cierren
    if (next) {
      const evt = new CustomEvent('card-dropdown-opened', {
        detail: { id: this.instanceId },
        bubbles: true,
      });
      // Disparar a nivel de window para que todos escuchen
      window.dispatchEvent(evt);
      this.setCardActive(true);
    } else {
      this.setCardActive(false);
    }
  }

  // Click en una opción
  selectItem(value: string): void {
    this.selectedItem = value;
    this.isOpen = false;
    this.setCardActive(false);
    // Aquí en el futuro podemos emitir un @Output si quieres "Editar / Eliminar"
  }

  // Cerrar al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const host = this.el.nativeElement;
    if (!host.contains(event.target as Node)) {
      this.isOpen = false;
      this.setCardActive(false);
    }
  }

  // Cerrar con Escape
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isOpen = false;
    this.setCardActive(false);
  }

  // Cerrar si otro dropdown se abrió
  @HostListener('window:card-dropdown-opened', ['$event'])
  onAnotherDropdownOpened(event: CustomEvent<{ id: number }>): void {
    const otherId = event?.detail?.id;
    if (otherId && otherId !== this.instanceId) {
      this.isOpen = false;
      this.setCardActive(false);
    }
  }

  private setCardActive(active: boolean): void {
    const host = this.el.nativeElement;
    const card = host.closest('.card');
    const grid = host.closest('.product-wrapper-grid');
    if (card) {
      if (active) card.classList.add('dropdown-active');
      else card.classList.remove('dropdown-active');
    }
    // Gestionar estado global para suprimir hovers en otras cards
    if (grid) {
      if (active) {
        grid.classList.add('has-active-dropdown');
      } else {
        // Verificar si queda algún otro dropdown activo antes de remover la clase global
        const anyActive = grid.querySelector('.card.dropdown-active');
        if (!anyActive) {
          grid.classList.remove('has-active-dropdown');
        }
      }
    }
  }
}
