import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'seed-spinner',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  @Input() spinnerSize: 'lg' | 'md' | 'sm' = 'lg';
  @Input() spinnerCenter = true;
}
