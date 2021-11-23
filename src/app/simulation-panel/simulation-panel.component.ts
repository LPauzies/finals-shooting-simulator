import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimulationParameters, SimulationParametersService } from 'src/app/services/simulation-parameters.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { ShootGeneratorService } from 'src/app/services/shoot-generator.service';
import { ShooterResult, ShooterModel } from 'src/app/simulation-panel/model';


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
  eliminatedNames: string[] = [];
  displayColumns: string[] = [];
  displayShootColumns: string[] = [];

  indexForFilling: number = 0;

  constructor(
    private simulationParametersService: SimulationParametersService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private shootGeneratorService: ShootGeneratorService
  ) {
    this.simulationSubscription = this.simulationParametersService.getCurrentSimulationParameters().subscribe(params => {
      this.languageService.getCurrentAppData().subscribe(data => {
        this.appData = data;
        if (!params.isDefault()) {
          this.simulationParameters = params;
          
          // Initialize data
          this.shooterResults = [];
          let IACount = ShooterModel.SHOOTER_NUMBER - this.simulationParameters.names.length;
          this.simulationParameters.names.forEach(name => this.shooterResults.push(new ShooterResult(name, this.appData.simulation.values.status.in)));
          for (let index = 1; index <= IACount; index++) {
            let name = `${this.appData.simulation.labels.ia} ${index}`;
            this.shooterResults.push(new ShooterResult(name, this.appData.simulation.values.status.in));
          }
          this.displayShootColumns = [...Array(24).keys()].map(x => `${x+1}`);
          this.displayColumns = ["rank", "name"].concat(this.displayShootColumns).concat(["total", "status"]);

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
    this.indexForFilling = 0;
  }

  validateShoot(): boolean {
    // Check if the shoot is OK when filled by human
    let humans = this.shooterResults.filter(x => !this.isIA(x.name));
    for (const human of humans) {
      let valueToCheck = human.getScoreForAShoot(this.indexForFilling);
      if (valueToCheck !== undefined && valueToCheck !== null) {
        if (valueToCheck < ShootGeneratorService.MIN_VALUE_SHOOT || valueToCheck > ShootGeneratorService.MAX_VALUE_SHOOT) {
          let formattedMessage: string = this.appData.message.errors.bad_value_shoot;
          formattedMessage = MessageService.formatMessage(formattedMessage, 0, human.name);
          formattedMessage = MessageService.formatMessage(formattedMessage, 1, valueToCheck.toString());
          this.messageService.openErrorMessage(formattedMessage);
          return false;
        }
        if (!ShootGeneratorService.isCorrectShoot(valueToCheck)) {
          let formattedMessage: string = this.appData.message.errors.too_much_decimals;
          formattedMessage = MessageService.formatMessage(formattedMessage, 0, valueToCheck.toString());
          formattedMessage = MessageService.formatMessage(formattedMessage, 1, human.name);
          this.messageService.openErrorMessage(formattedMessage);
          return false;
        }
      } else {
        let formattedMessage: string = this.appData.message.errors.no_value_shoot;
          formattedMessage = MessageService.formatMessage(formattedMessage, 0, human.name);
          this.messageService.openErrorMessage(formattedMessage);
        return false;
      }
    }
    return true;
  }

  generateAIShoot(): void {
    this.shooterResults.filter(x => this.isIA(x.name)).forEach(shooterAI => {
      shooterAI.setScoreForAShoot(this.shootGeneratorService.generateRandomShoot(), this.indexForFilling);
    });
  }

  computeTotalScores(): void {
    this.shooterResults.forEach(shooter => shooter.computeTotal());
  }

  sortAndRank(): void {
    // TODO
  }

  validateGenerateAndGoToNextShoot(): void {
    if (!this.validateShoot()) return;
    this.generateAIShoot();
    this.computeTotalScores();
    this.sortAndRank();
    this.indexForFilling++;
  }

  formatShootColumn(shootNumber: string) {
    return `${this.appData.simulation.labels.shoot} ${shootNumber}`;
  }

  isIA(name: string): boolean {
    return name.includes(this.appData.simulation.labels.ia)
  }

}
