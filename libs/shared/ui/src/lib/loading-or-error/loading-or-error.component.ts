import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { SpinnerComponent } from './../spinner/spinner.component';

@Component({
  selector: 'seed-loading-or-error',
  standalone: true,
  imports: [CommonModule, ClarityModule, SpinnerComponent],
  templateUrl: './loading-or-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOrErrorComponent {
  @Input() error: HttpErrorResponse | null = null;
  @Input() alertSmall = false;
  @Input() spinnerSize: 'lg' | 'md' | 'sm' = 'lg';
  @Input() spinnerCenter = true;
}
