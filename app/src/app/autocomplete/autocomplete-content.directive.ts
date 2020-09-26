import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[appAutocompleteContent]",
})
export class AutocompleteContentDirective {
  constructor(public readonly tpl: TemplateRef<any>) {}
}
