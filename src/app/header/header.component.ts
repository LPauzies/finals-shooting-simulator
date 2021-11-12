import { Component, OnInit } from '@angular/core';
import AppJson from 'src/assets/data/app.json';
import { LanguageCookieService } from 'src/app/services/cookie.service';

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

  constructor(private languageCookieService: LanguageCookieService) {
    this.appTitle = AppJson.title;
    this.logoTitle = "./assets/img/logo/logo_issf_with_title.png";
    this.languages = LanguageCookieService.AVAILABLE_LANGUAGES;
  }

  ngOnInit(): void {
    let lang = (this.languageCookieService.checkLanguage()) ? this.languageCookieService.getLanguage() : this.getDefaultLanguage();
    this.setLanguage(lang);
  }

  getDefaultLanguage(): string {
    let browserLanguage = navigator.language;
    let foundLanguage = LanguageCookieService.AVAILABLE_LANGUAGES.find(language => browserLanguage.includes(language.language))
    return (foundLanguage) ? foundLanguage.language : LanguageCookieService.DEFAULT_LANGUAGE;
  }

  setLanguage(isoCountry: string): void {
    this.languageCookieService.setLanguage(isoCountry);
    this.selectedLanguage = isoCountry;
  }

}
