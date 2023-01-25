import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClarityIcons, cogIcon, vmBugIcon } from '@cds/core/icon';
import { ClarityModule } from '@clr/angular';

ClarityIcons.addIcons(cogIcon, vmBugIcon);

@Component({
  selector: 'seed-navbar',
  standalone: true,
  imports: [CommonModule, ClarityModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent {}
