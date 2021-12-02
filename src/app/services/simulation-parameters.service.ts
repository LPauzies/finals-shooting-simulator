import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export class SimulationParameters {

    static DEFAULT_STRING = "";
    static DEFAULT_ARRAY = [];

    sex: string;
    sexLabel: string;
    category: string;
    categoryLabel: string;
    weapon: string;
    weaponLabel: string;
    level: string;
    levelLabel: string;
    names: Array<string>;
  
    constructor(sex: string, sexLabel: string, category: string, categoryLabel: string, weapon: string, weaponLabel: string, level: string, levelLabel: string, names: Array<string>) {
      this.sex = sex;
      this.sexLabel = sexLabel;
      this.category = category;
      this.categoryLabel = categoryLabel;
      this.weapon = weapon;
      this.weaponLabel = weaponLabel;
      this.level = level;
      this.levelLabel = levelLabel;
      this.names = names;
    }

    static getDefaultSimulationParameters() {
        return new SimulationParameters(
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_STRING,
            SimulationParameters.DEFAULT_ARRAY);
    }

    isDefault(): boolean {
        let res = this.sex == SimulationParameters.DEFAULT_STRING;
        res = res && this.category == SimulationParameters.DEFAULT_STRING;
        res = res && this.level == SimulationParameters.DEFAULT_STRING;
        res = res && this.sexLabel == SimulationParameters.DEFAULT_STRING;
        res = res && this.categoryLabel == SimulationParameters.DEFAULT_STRING;
        res = res && this.levelLabel == SimulationParameters.DEFAULT_STRING;
        res = res && this.names.length == 0;
        return res;
    }
  
}

@Injectable({
    providedIn: 'root'
})
export class SimulationParametersService {

    constructor() {}

    private parameters = new BehaviorSubject(SimulationParameters.getDefaultSimulationParameters());
    private currentSimulationParameters = this.parameters.asObservable();

    getCurrentSimulationParameters(): Observable<SimulationParameters> {
        return this.currentSimulationParameters;
    }

    changeCurrentSimulationParameters(simulationParameters: SimulationParameters): void {
        this.parameters.next(simulationParameters);
    }

    private isSimulation = new BehaviorSubject(false);
    private isCurrentSimulation = this.isSimulation.asObservable();

    getIsCurrentSimulation(): Observable<boolean> {
        return this.isCurrentSimulation;
    }

    changeIsCurrentSimulation(currentSimulation: boolean) {
        this.isSimulation.next(currentSimulation);
    }

}