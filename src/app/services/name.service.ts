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
        "Thibault",
        "Axel",
        "Arthur",
        "Evan",
        "Adrien",
        "Alexis",
        "Antoine",
        "Adam",
        "Alexandre",
        "Baptiste",
        "Enzo",
        "Julien",
        "Leo",
        "Lucas",
        "Matteo",
        "Mael",
        "Maxime",
        "Gabriel",
        "Raphael",
        "Pierre",
        "Quentin",
        "Hugo",
        "Romain",
        "Theo",
        "Tom",
        "Jules",
        "Nicolas",
        "Louis",
        "Mathis"
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
        "Auriane",
        "Camille",
        "Anais",
        "Clara",
        "Emma",
        "Charlotte",
        "Celia",
        "Eva",
        "Ambre",
        "Clemence",
        "Juliette",
        "Lena",
        "Lea",
        "Jeanne",
        "Julie",
        "Maeva",
        "Mathilde",
        "Louise",
        "Lucie",
        "Manon",
        "Noemie",
        "Elodie",
        "Fanny",
        "Alice",
        "Anna",
        "Apolline",
        "Candice",
        "Charline",
        "Elise"
    ]

    constructor() {}

    getRandomMaleName(): string {
        return NameService.M_NAMES[Math.floor(Math.random() * NameService.M_NAMES.length)];
    }

    getRandomFemaleName(): string {
        return NameService.F_NAMES[Math.floor(Math.random() * NameService.F_NAMES.length)];
    }

}