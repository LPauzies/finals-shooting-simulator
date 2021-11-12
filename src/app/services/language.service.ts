import { Injectable } from '@angular/core';
import { LanguageCookieService } from 'src/app/services/cookie.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    constructor(
        private languageCookieService: LanguageCookieService,
        private httpClient: HttpClient
    ) {}

    getAppData(): Observable<any> {
        let language = this.languageCookieService.getLanguage();
        return this.httpClient.get(`/assets/data/static/${language}.json`);
    }

}