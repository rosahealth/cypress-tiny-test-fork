import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { AutocompleteOptionsComponent } from './autocomplete-options.component';
import { AutocompleteDirective } from './autocomplete.directive';
import { OptionComponent } from './option.component';

const publicApi = [
  AutocompleteOptionsComponent,
  AutocompleteContentDirective,
  OptionComponent,
  AutocompleteDirective,
];

@NgModule({
  declarations: [publicApi],
  exports: [publicApi],
  imports: [CommonModule, ReactiveFormsModule, OverlayModule],
})
export class AutocompleteModule {}
