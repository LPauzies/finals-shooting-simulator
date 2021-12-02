import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ShootService {

    static MIN_VALUE_SHOOT = 0.0;
    static MAX_VALUE_SHOOT = 10.9;

    static DEFAULT_PRECISION = 10; // Decimals at 10e-1

    constructor() {}

    provideShooterGenerator() {}

    // For placeholding purpose
    generateRandomShoot(): number {
        return ShootService.getRandomShoot(ShootService.MIN_VALUE_SHOOT, ShootService.MAX_VALUE_SHOOT);
    }

    static getRandomShoot(min: number, max: number) {
        let randomShoot = Math.random() * (max - min) + min;
        return Math.floor(randomShoot * ShootService.DEFAULT_PRECISION) / ShootService.DEFAULT_PRECISION;
    }

    // Shoot checker
    static isCorrectShoot(shootValue: number): boolean {
        let maxDecimals = ShootService.DEFAULT_PRECISION.toString().length - 1;
        if (Math.floor(shootValue) === shootValue) return true;
        let decimals = shootValue.toString().split(".")[1].length;
        return maxDecimals >= decimals;
    }
}