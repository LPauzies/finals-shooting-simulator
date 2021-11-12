import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NameService {

    public static readonly M_NAMES = [
        "Charles",
        "Lucas",
        "Lilian",
        "Bastien",
        "Sébastien",
        "José",
        "Fabien",
        "Raymond",
        "Arnaud",
        "Thibault"
    ]

    public static readonly F_NAMES = [
        "Valérie",
        "Marlène",
        "Pauline",
        "Michelle",
        "Monique",
        "Andréa",
        "Chloé",
        "Zoé",
        "Emma",
        "Auriane"
    ]

    constructor() {}

    getRandomMaleName(): string {
        return NameService.M_NAMES[Math.floor(Math.random() * NameService.M_NAMES.length)];
    }

    getRandomFemaleName(): string {
        return NameService.F_NAMES[Math.floor(Math.random() * NameService.F_NAMES.length)];
    }

}