import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list'; 
import {MatButtonModule} from '@angular/material/button'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatSelectModule} from '@angular/material/select'; 
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
