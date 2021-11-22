import { Component, OnInit } from '@angular/core';
import AppJson from 'src/assets/data/app.json';
import { LanguageCookieService } from 'src/app/services/cookie.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  appTitle: string;
  logoTitle: string;
  languages: Array<any>;
  selectedLanguage? : string;

  constructor(
    private languageCookieService: LanguageCookieService,
    private languageService: LanguageService
  
  ) {
    this.appTitle = AppJson.title;
    this.logoTitle = "./assets/img/logo/logo_issf_with_title.png";
    this.languages = LanguageCookieService.AVAILABLE_LANGUAGES;
  }

  ngOnInit(): void {
    let cookieExists = this.languageCookieService.checkLanguage()
    let language = (cookieExists) ? this.languageCookieService.getLanguage() : this.getDefaultLanguage();
    this.languageCookieService.setLanguage(language);
    this.languageService.setCurrentAppData(language);
    this.selectedLanguage = language;
  }

  getDefaultLanguage(): string {
    let browserLanguage = navigator.language;
    let foundLanguage = LanguageCookieService.AVAILABLE_LANGUAGES.find(language => browserLanguage.includes(language.language))
    return (foundLanguage) ? foundLanguage.language : LanguageCookieService.DEFAULT_LANGUAGE;
  }

  setLanguage(isoCountry: string): void {
    this.languageCookieService.setLanguage(isoCountry);
    this.languageService.setCurrentAppData(isoCountry);
    this.selectedLanguage = isoCountry;
  }

}
