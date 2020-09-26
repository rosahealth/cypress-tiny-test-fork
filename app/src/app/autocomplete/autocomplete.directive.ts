import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { RepositionOverlayService } from "../overlay-service/reposition-overlay.service";

import { AutocompleteOptionsComponent } from "./autocomplete-options.component";

@Directive({
  selector: "[appAutocomplete]",
})
export class AutocompleteDirective implements OnInit, OnDestroy {
  @Input() public readonly appAutocomplete: AutocompleteOptionsComponent;

  private readonly destroy$ = new Subject<void>();
  private overlayRef: OverlayRef;

  @HostListener("keydown", ["$event"])
  public handleKeydown(event: KeyboardEvent): void {
    if (this.overlayRef) {
      if (event.key === "Escape") {
        event.stopPropagation();

        this.close();
        this.origin.blur();
      }

      if (event.key === "Tab") {
        event.stopPropagation();
        this.close();
      }
    }
  }

  constructor(
    private readonly host: ElementRef<HTMLInputElement>,
    private readonly vcr: ViewContainerRef,
    private readonly overlay: Overlay,
    private readonly repositionOverlayService: RepositionOverlayService
  ) {
    this.repositionOverlayService.reposition$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.overlayRef) {
          this.overlayRef.updatePosition();
        }
      });
  }

  public ngOnInit(): void {
    fromEvent(this.origin, "focus")
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.overlayRef) {
          this.openDropdown();
          this.appAutocomplete
            .optionsClick()
            .pipe(takeUntil(this.overlayRef.detachments()))
            .subscribe(() => {
              this.close();
            });
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openDropdown(): void {
    if (this.overlayRef) {
      return;
    }
    this.overlayRef = this.overlay.create({
      width: this.origin.offsetWidth,
      maxHeight: 60 * 5,
      backdropClass: "",
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.getOverlayPosition(),
    });

    const template = new TemplatePortal(
      this.appAutocomplete.rootTemplate,
      this.vcr
    );
    this.overlayRef.attach(template);

    overlayClickOutside(this.overlayRef, this.origin).subscribe(() =>
      this.close()
    );
  }

  private close(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private getOverlayPosition(): FlexibleConnectedPositionStrategy {
    const positions = [
      new ConnectionPositionPair(
        { originX: "start", originY: "bottom" },
        { overlayX: "start", overlayY: "top" }
      ),
      new ConnectionPositionPair(
        { originX: "start", originY: "top" },
        { overlayX: "start", overlayY: "bottom" }
      ),
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }

  public get origin() {
    return this.host.nativeElement;
  }
}

export function overlayClickOutside(
  overlayRef: OverlayRef,
  origin: HTMLElement
) {
  return fromEvent<MouseEvent>(document, "click").pipe(
    filter((event) => {
      const clickTarget = event.target as HTMLElement;
      // the input
      const notOrigin = clickTarget !== origin;
      // the autocomplete
      const notOverlay =
        !!overlayRef &&
        overlayRef.overlayElement.contains(clickTarget) === false;
      return notOrigin && notOverlay;
    }),
    takeUntil(overlayRef.detachments())
  );
}
