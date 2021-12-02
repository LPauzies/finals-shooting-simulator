import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NormalDistributionService {

    constructor() {}

    // Maths purpose for inverted standard law
    static computeCk(k: number): number {
        // Implementation of Inverted Error function for Probability processes
        // @see https://en.wikipedia.org/wiki/Error_function
        if (!Number.isInteger(k)) throw new Error(`Iterator is not an integer value : ${k}`);
        if (k < 0) throw new Error(`Iterator is not a positive integer value : ${k}`);
        if (k === 0) return 1;
        // Start process
        let coefficients = [1]; // Init : C0 = 1
        for (let k_ = 1; k_ < k + 1; k_++) { // For each k value
            // Calculate coefficients C0, C1, C2, ... to calculate Ck
            let coefficientsStackForCurrentCoefficient = [];
            for (let m = 0; m < k_; m++) { // Sum from m = 0 to m = k - 1
                let coeff = (coefficients[m] * coefficients[k_-1-m]) / ((m+1) * (2*m+1));
                coefficientsStackForCurrentCoefficient.push(coeff);
            }
            // Make the sum and push it to coefficients collection
            coefficients.push(coefficientsStackForCurrentCoefficient.reduce((a, b) => a + b, 0));
        }
        return coefficients[coefficients.length - 1];
    }

    static computeInvertedERF(value: number): number {
        // Implementation of Inverted Error function
        // @see https://en.wikipedia.org/wiki/Error_function
        // Here we consider infinity to be 10 which is sufficient
        let resultStack = [];
        for (let k = 0; k < 10; k++) {
            let ck = NormalDistributionService.computeCk(k);
            let a = 2*k+1
            resultStack.push((ck / a) * Math.pow((Math.sqrt(Math.PI) / 2) * value, a));
        }
        return resultStack.reduce((a, b) => a + b, 0);
    }

    static computeInvertedStandardLaw(probability: number, mu: number, sigma: number): number {
        return (sigma * Math.sqrt(2) * NormalDistributionService.computeInvertedERF((2 * probability) - 1)) + mu;
    }

}