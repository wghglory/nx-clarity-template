import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'seed-loading-or-error',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './loading-or-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOrErrorComponent {
  @Input() error: HttpErrorResponse | null = null;
  @Input() alertSmall = false;
  @Input() spinnerSize: 'lg' | 'md' | 'sm' = 'lg';
  @Input() spinnerCenter = true;
}
