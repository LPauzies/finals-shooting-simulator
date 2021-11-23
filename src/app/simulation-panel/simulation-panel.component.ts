import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimulationParameters, SimulationParametersService } from 'src/app/services/parameters.service';
import { LanguageService } from 'src/app/services/language.service';

export interface ShooterResult {
  name: string;
  rank: number | null;
  status: string | null;
  "1": number | null;
  2: number | null;
  3: number | null;
  4: number | null;
  5: number | null;
  6: number | null;
  7: number | null;
  8: number | null;
  9: number | null;
  10: number | null;
  11: number | null;
  12: number | null;
  13: number | null;
  14: number | null;
  15: number | null;
  16: number | null;
  17: number | null;
  18: number | null;
  19: number | null;
  20: number | null;
  21: number | null;
  22: number | null;
  23: number | null;
  24: number | null;
}

@Component({
  selector: 'app-simulation-panel',
  templateUrl: './simulation-panel.component.html',
  styleUrls: ['./simulation-panel.component.scss']
})
export class SimulationPanelComponent implements OnInit {

  isSimulationGenerated: boolean = false;
  simulationSubscription: Subscription;
  simulationParameters?: SimulationParameters;
  appData?: any;

  // Feature for Simulation feature
  shooterResults: ShooterResult[] = [];
  displayColumns: string[] = [];
  displayShootColumns: string[] = [];

  indexForFilling: number = 1;

  constructor(
    private simulationParametersService: SimulationParametersService,
    private languageService: LanguageService
  ) {
    this.simulationSubscription = this.simulationParametersService.getCurrentSimulationParameters().subscribe(params => {
      this.languageService.getCurrentAppData().subscribe(data => {
        this.appData = data.simulation;
        if (!params.isDefault()) {
          this.simulationParameters = params;
          
          // Initialize data
          this.shooterResults = [];
          let IACount = 8 - this.simulationParameters.names.length;
          this.simulationParameters.names.forEach(name => this.shooterResults.push(this.createDefaultShooterResult(name, this.appData.values.status.in)));
          for (let index = 1; index <= IACount; index++) {
            let name = `${this.appData.labels.ia} ${index}`;
            this.shooterResults.push(this.createDefaultShooterResult(name, this.appData.values.status.in));
          }
          this.displayShootColumns = [...Array(24).keys()].map(x => `${x+1}`);
          this.displayColumns = ["rank", "name"].concat(this.displayShootColumns).concat(["status"]);

          this.isSimulationGenerated = true;
        } else {
          this.isSimulationGenerated = false;
        }
      });
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.simulationSubscription.unsubscribe();
  }

  deleteSimulation(): void {
    this.simulationParametersService.changeCurrentSimulationParameters(
      SimulationParameters.getDefaultSimulationParameters()
    );
    this.isSimulationGenerated = false;
    this.simulationParametersService.changeIsCurrentSimulation(false);
    // Reset the filling simulation
    this.indexForFilling = 1;
  }

  validateShoot(): void {
    // Check if the shoot is OK when filled by human
    let humans = this.shooterResults.filter(x => !this.isIA(x.name));
    for (const human of humans) {
      let valueToCheck = human[this.indexForFilling as keyof ShooterResult];
      if (valueToCheck !== null) {
        if (valueToCheck < 0 || valueToCheck > 10.9) {
          console.log("TODO error management");
          return;
        }
      } else {
        console.log("TODO error management");
        return;
      }
    }
    this.indexForFilling++;
    
  }

  createDefaultShooterResult(name: string, status: string): ShooterResult {
    return {
      name: name, status: status, rank: null,
      1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null,
      11: null, 12: null, 13: null, 14: null, 15: null, 16: null, 17: null, 18: null, 19: null, 20: null,
      21: null, 22: null, 23: null, 24: null
    }
  }

  isIA(name: string): boolean {
    return name.includes(this.appData.labels.ia)
  }

}
