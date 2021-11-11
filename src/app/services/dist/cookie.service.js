"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LanguageCookieService = void 0;
var core_1 = require("@angular/core");
var LanguageCookieService = /** @class */ (function () {
    function LanguageCookieService(cookieService) {
        this.cookieService = cookieService;
    }
    LanguageCookieService_1 = LanguageCookieService;
    LanguageCookieService.prototype.setLanguage = function (isoCountry) {
        this.cookieService.set(LanguageCookieService_1.KEY, isoCountry, LanguageCookieService_1.DEFAULT_EXPIRATION_VALUE);
    };
    LanguageCookieService.prototype.getLanguage = function () {
        return this.cookieService.get(LanguageCookieService_1.KEY);
    };
    var LanguageCookieService_1;
    LanguageCookieService.KEY = "language";
    LanguageCookieService.DEFAULT_EXPIRATION_VALUE = 365;
    LanguageCookieService = LanguageCookieService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], LanguageCookieService);
    return LanguageCookieService;
}());
exports.LanguageCookieService = LanguageCookieService;
