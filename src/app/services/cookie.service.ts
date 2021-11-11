import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class LanguageCookieService {

    public static readonly KEY = "language"
    public static readonly DEFAULT_EXPIRATION_VALUE = 365
    // Available language values
    public static readonly AVAILABLE_LANGUAGES = [
        { language: "fr", flag: "fr" }, 
        { language: "en", flag: "gb" }
    ]
    public static readonly DEFAULT_LANGUAGE = "en"

    constructor(
        private cookieService: CookieService 
    ) {}

    setLanguage(isoCountry: string): void {
        this.cookieService.set(LanguageCookieService.KEY, isoCountry, LanguageCookieService.DEFAULT_EXPIRATION_VALUE);
    }

    getLanguage(): string {
        return this.cookieService.get(LanguageCookieService.KEY);
    }

    checkLanguage(): boolean {
        return this.cookieService.check(LanguageCookieService.KEY);
    }

}