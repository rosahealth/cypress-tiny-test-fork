import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "autocomplete-test";

  public options = this.generateOptions(10);
  public control = new FormControl();

  public filteredOptions$: Observable<Array<{ id: number; label: string }>>;

  public ngOnInit() {
    this.filteredOptions$ = this.control.valueChanges.pipe(
      map((v: string) =>
        v && v.length !== 0
          ? this.options.filter(
              (o) => o.label.toLowerCase().indexOf(v.toLowerCase()) !== -1
            )
          : []
      )
    );
  }

  private generateOptions(numberOfOptions: number): any[] {
    const generatedOptions = [];
    for (let i = 1; i <= numberOfOptions; i++) {
      generatedOptions.push({ id: i, label: `Option ${i}` });
    }
    return generatedOptions;
  }
}
