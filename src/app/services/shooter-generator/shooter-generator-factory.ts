import { ShooterGenerator } from 'src/app/services/shooter-generator/shooter-generator';
import ShooterGeneratorData from './shooter-generator-data.json';

type ProbabilityData = {
    [key: string]: any
}

export class ShooterGeneratorFactory {

    // International level
    static DEFAULT_MU = 10.305;
    static DEFAULT_SIGMA = 0.366958074;

    constructor() {}

    public static createShooterGenerator(category: string, level: string, weapon: string): ShooterGenerator {
        let shooterGeneratorDataMap = new Map(Object.entries(ShooterGeneratorData));
        let shooterGeneratorDataWeapon = shooterGeneratorDataMap.get(weapon);
        if (shooterGeneratorDataWeapon) {
            let shooterGeneratorDataWeaponMap = new Map(Object.entries(shooterGeneratorDataWeapon));
            let shooterGeneratorDataCategory = shooterGeneratorDataWeaponMap.get(category);
            if (shooterGeneratorDataCategory) {
                let shooterGeneratorDataCategoryMap = new Map(Object.entries(shooterGeneratorDataCategory));
                let shooterGeneratorDataCategoryLevel = shooterGeneratorDataCategoryMap.get(level);
                if (shooterGeneratorDataCategoryLevel) {
                    let mu = shooterGeneratorDataCategoryLevel.mu;
                    let sigma = shooterGeneratorDataCategoryLevel.sigma;
                    return new ShooterGenerator(mu, sigma);
                }
            }
        }
        console.log("It should never happens");
        return new ShooterGenerator(ShooterGeneratorFactory.DEFAULT_MU, ShooterGeneratorFactory.DEFAULT_SIGMA);
    }

}