import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  shooterResults: MatTableDataSource<ShooterResult>;
  eliminatedNames: string[] = [];
  displayColumns: string[] = [];
  displayShootColumns: string[] = [];

  indexForFilling: number = 0;

  // Part of data model to call from HTML template
  trend_up: number = ShooterModel.TREND_UP;
  trend_equal: number = ShooterModel.TREND_EQUAL;
  trend_down: number = ShooterModel.TREND_DOWN;

  constructor(
    private simulationParametersService: SimulationParametersService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private shootGeneratorService: ShootGeneratorService
  ) {
    this.shooterResults = new MatTableDataSource();
    this.simulationSubscription = this.simulationParametersService.getCurrentSimulationParameters().subscribe(params => {
      this.languageService.getCurrentAppData().subscribe(data => {
        this.appData = data;
        if (!params.isDefault()) {
          this.simulationParameters = params;
          
          // Initialize data
          this.shooterResults.data = [];
          let IACount = ShooterModel.SHOOTER_NUMBER - this.simulationParameters.names.length;
          this.simulationParameters.names.forEach(name => this.shooterResults.data.push(new ShooterResult(name, "person", this.appData.simulation.values.status.in)));
          for (let index = 1; index <= IACount; index++) {
            let name = `${this.appData.simulation.labels.ia} ${index}`;
            this.shooterResults.data.push(new ShooterResult(name, "computer", this.appData.simulation.values.status.in));
          }
          this.displayShootColumns = [...Array(24).keys()].map(x => `${x+1}`);
          this.displayColumns = ["trend", "rank", "icon", "name"].concat(this.displayShootColumns).concat(["total", "status"]);

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
    let humans = this.shooterResults.data.filter(x => !this.isIA(x.name));
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
    this.shooterResults.data.filter(x => this.isIA(x.name)).forEach(shooterAI => {
      shooterAI.setScoreForAShoot(this.shootGeneratorService.generateRandomShoot(), this.indexForFilling);
    });
  }

  computeTotalScores(): void {
    this.shooterResults.data.forEach(shooter => shooter.computeTotal());
  }

  sortTrendAndRank(): void {
    let previousState: ShooterResult[] = JSON.parse(JSON.stringify(this.shooterResults.data));
    // Each one of these collections have same length (8 shooters)
    this.shooterResults.data = this.shooterResults.data.sort((s1, s2) => s2.total - s1.total);
    for (let index = 0; index < this.shooterResults.data.length; index++) {
      this.shooterResults.data[index].rank = index + 1;
      if (previousState[index].rank != null) {
        let currentRankTotal = this.shooterResults.data[index].total;
        let previousRankTotal = previousState[index].total;
        if (currentRankTotal > previousRankTotal) this.shooterResults.data[index].trend = this.trend_up;
        else if (currentRankTotal < previousRankTotal) this.shooterResults.data[index].trend = this.trend_down;
        else this.shooterResults.data[index].trend = this.trend_equal;
      }
    }
  }

  validateGenerateAndGoToNextShoot(): void {
    if (!this.validateShoot()) return;
    this.generateAIShoot();
    this.computeTotalScores();
    this.sortTrendAndRank();
    this.indexForFilling++;
  }

  formatShootColumn(shootNumber: string) {
    return `${this.appData.simulation.labels.shoot} ${shootNumber}`;
  }

  isIA(name: string): boolean {
    return name.includes(this.appData.simulation.labels.ia)
  }

}
