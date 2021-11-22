import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list'; 
import { MatToolbarModule } from '@angular/material/toolbar'; 


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TcuDialogComponent } from './tcu-dialog/tcu-dialog.component';


import { LanguageCookieService } from 'src/app/services/cookie.service';
import { LanguageService } from 'src/app/services/language.service';
import { SimulationParametersService } from 'src/app/services/parameters.service';
import { SimulationPanelComponent } from './simulation-panel/simulation-panel.component';
import { HelpComponent } from './help/help.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
    TcuDialogComponent,
    SimulationPanelComponent,
    HelpComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatGridListModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule
  ],
  providers: [
    CookieService,
    LanguageCookieService,
    LanguageService,
    SimulationParametersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
