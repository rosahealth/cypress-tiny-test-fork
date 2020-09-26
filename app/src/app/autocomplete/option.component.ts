import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
} from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { mapTo } from "rxjs/operators";

@Component({
  selector: "ui-option",
  template: `<ng-content></ng-content>`,
  styleUrls: ["./option.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent implements OnInit {
  @Input() public value: any;
  public click$: Observable<any>;

  // TODO: explain what this property 'active' does
  //  How to change it?
  //  Where is this used?
  @HostBinding("class.active") public active = true;

  constructor(public readonly host: ElementRef) {}

  public ngOnInit(): void {
    this.click$ = fromEvent(this.host.nativeElement, "click").pipe(
      mapTo(this.value)
    );
  }
}
