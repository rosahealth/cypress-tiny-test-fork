import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RepositionOverlayService } from "./overlay-service/reposition-overlay.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutocompleteModule } from "./autocomplete/autocomplete.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteModule,
  ],
  providers: [RepositionOverlayService],
  bootstrap: [AppComponent],
})
export class AppModule {}
