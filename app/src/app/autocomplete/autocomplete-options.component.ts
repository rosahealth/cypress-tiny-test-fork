import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { merge, Observable, Subject } from "rxjs";
import { switchMap, takeUntil, tap } from "rxjs/operators";

import { AutocompleteContentDirective } from "./autocomplete-content.directive";
import { OptionComponent } from "./option.component";

@Component({
  selector: "autocomplete-options",
  template: `
    <ng-template #root>
      <div class="autocomplete">
        <ng-container *ngTemplateOutlet="content.tpl"></ng-container>
      </div>
    </ng-template>
  `,
  styleUrls: ["./autocomplete-options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: "appAutocomplete",
})
export class AutocompleteOptionsComponent implements AfterViewInit, OnDestroy {
  @ViewChild("root") public readonly rootTemplate: TemplateRef<any>;
  @Output() public readonly optionSelect = new EventEmitter();
  @ContentChild(AutocompleteContentDirective)
  public readonly content: AutocompleteContentDirective;
  @ContentChildren(OptionComponent) public readonly options: QueryList<
    OptionComponent
  >;

  private readonly destroy$ = new Subject<void>();

  public ngAfterViewInit(): void {
    this.optionsClick()
      .pipe(
        takeUntil(this.destroy$),
        tap((v) => this.optionSelect.emit(v))
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public optionsClick(): Observable<any> {
    return this.options.changes.pipe(
      switchMap((options: Array<any>) => {
        const clicks$ = options.map((option) => option.click$);
        return merge(...clicks$);
      })
    );
  }
}
