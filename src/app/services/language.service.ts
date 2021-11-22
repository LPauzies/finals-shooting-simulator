import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, first } from 'rxjs';
import { LanguageCookieService } from 'src/app/services/cookie.service';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    static DEFAULT_APP_DATA = {}

    private appData = new BehaviorSubject(LanguageService.DEFAULT_APP_DATA);
    private currentAppData = this.appData.asObservable();

    constructor(
        private httpClient: HttpClient
    ) {
        this.getDefaultAppData();
    }

    getCurrentAppData(): Observable<any> {
        return this.currentAppData;
    }

    setCurrentAppData(language: string): void {
        this.httpClient.get(`./assets/data/static/${language}.json`).subscribe(json => this.appData.next(json))
    }

    getDefaultAppData(): void {
        let language = LanguageService.getDefaultLanguage();
        this.httpClient.get(`./assets/data/static/${language}.json`).pipe(first()).subscribe(
            appData => {
                this.appData.next(appData);
            }
        );
    }

    static getDefaultLanguage(): string {
        let browserLanguage = navigator.language;
        let foundLanguage = LanguageCookieService.AVAILABLE_LANGUAGES.find(language => browserLanguage.includes(language.language))
        return (foundLanguage) ? foundLanguage.language : LanguageCookieService.DEFAULT_LANGUAGE;
    }

    static isDefaultAppData(object: any): boolean {
        return Object.keys(object).length === 0;
    }
}