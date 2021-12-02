import { NormalDistributionService } from 'src/app/services/normal-distribution.service';

export class ShooterGenerator {

    static MIN_VALUE_SHOOT = 0.0;
    static MAX_VALUE_SHOOT = 10.9;

    mu: number;
    sigma: number;

    constructor(mu: number, sigma: number) {
        this.mu = mu;
        this.sigma = sigma;
    }

    generateShoot(): number {
        let probabilityTypeShoot = Math.random();
        if (probabilityTypeShoot <= 0.05) return this.generateStandardDistributionShoot(this.mu - 1.7*this.sigma);
        if (probabilityTypeShoot <= 0.10) return this.generateStandardDistributionShoot(this.mu - 1.3*this.sigma);
        if (probabilityTypeShoot >= 0.90) return this.generateStandardDistributionShoot(this.mu + 1.3*this.sigma);
        if (probabilityTypeShoot >= 0.95) return this.generateStandardDistributionShoot(this.mu + 1.7*this.sigma);
        return this.generateStandardDistributionShoot();
    }

    generateStandardDistributionShoot(mu?: number): number {
        let customMu = mu || this.mu;
        let shoot = NormalDistributionService.computeInvertedStandardLaw(Math.random(), customMu, this.sigma);
        if (shoot > ShooterGenerator.MAX_VALUE_SHOOT) return ShooterGenerator.MAX_VALUE_SHOOT;
        if (shoot < ShooterGenerator.MIN_VALUE_SHOOT) return ShooterGenerator.MIN_VALUE_SHOOT;
        return Math.floor(shoot * 10) / 10;
    }

}