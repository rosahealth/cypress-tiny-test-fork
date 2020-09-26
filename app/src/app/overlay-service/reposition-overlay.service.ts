import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RepositionOverlayService {
  private readonly reposition$$ = new ReplaySubject<void>();

  public readonly reposition$: Observable<void> = this.reposition$$.asObservable();

  public reposition(): void {
    this.reposition$$.next();
  }
}
