import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';

@NgModule({
  imports: [],
  exports: [RouterTestingModule, HttpClientTestingModule, CommonModule, ClarityModule],
})
export class SharedSpecModule {}
