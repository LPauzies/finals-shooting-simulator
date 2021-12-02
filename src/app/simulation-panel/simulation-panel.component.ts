import { Component, OnInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SimulationParameters, SimulationParametersService } from 'src/app/services/simulation-parameters.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { NormalDistributionService } from 'src/app/services/normal-distribution.service';
import { ShootService } from 'src/app/services/shoot.service';
import { ShooterResult, ShooterModel } from 'src/app/simulation-panel/model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WinnerDialogComponent } from '../winner-dialog/winner-dialog.component';
import { ShooterGeneratorFactory } from 'src/app/services/shooter-generator/shooter-generator-factory';

export interface WinnerDialogData {
  shooter: ShooterResult
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
  shooterGenerator?: any;

  // Feature for Simulation feature
  shooterResults: MatTableDataSource<ShooterResult>;
  displayColumns: string[] = [];
  displayShootColumns: string[] = [];

  indexForFilling: number = 0;

  isSimulationFinished = false;

  // Part of data model to call from HTML template
  trendUp: number = ShooterModel.TREND_UP;
  trendEqual: number = ShooterModel.TREND_EQUAL;
  trendDown: number = ShooterModel.TREND_DOWN;
  // Static part through simulator
  // Index starts at 0
  eliminationPhase: number[] = [11, 13, 15, 17, 19, 21, 23];

  constructor(
    private simulationParametersService: SimulationParametersService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private normalDistributionService: NormalDistributionService,
    private shootService: ShootService,
    public dialog: MatDialog
  ) {
    this.shooterResults = new MatTableDataSource();
    this.simulationSubscription = this.simulationParametersService.getCurrentSimulationParameters().subscribe(params => {
      this.languageService.getCurrentAppData().subscribe(data => {
        this.appData = data;
        if (!params.isDefault()) {
          this.simulationParameters = params;
          this.shooterGenerator = ShooterGeneratorFactory.createShooterGenerator(params.category, params.level, params.weapon);
          
          // Initialize data
          this.shooterResults.data = [];
          let IACount = ShooterModel.SHOOTER_NUMBER - this.simulationParameters.names.length;
          this.simulationParameters.names.forEach(name => this.shooterResults.data.push(new ShooterResult(name, "person")));
          for (let index = 1; index <= IACount; index++) {
            let name = `${this.appData.simulation.labels.ia} ${index}`;
            this.shooterResults.data.push(new ShooterResult(name, "computer"));
          }
          // Columns shoot ids
          this.displayShootColumns = [...Array(24).keys()].map(x => `${x+1}`);
          // Columns all ids
          this.displayColumns = ["trend", "rank", "icon", "name"].concat(this.displayShootColumns).concat(["total", "eliminated"]);

          this.isSimulationGenerated = true;
        } else {
          this.isSimulationGenerated = false;
        }
      });
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.simulationSubscription.unsubscribe();
  }

  deleteSimulation(): void {
    this.simulationParametersService.changeCurrentSimulationParameters(
      SimulationParameters.getDefaultSimulationParameters()
    );
    // Reset the simulation
    this.isSimulationGenerated = false;
    this.simulationParametersService.changeIsCurrentSimulation(false);
    this.indexForFilling = 0;
    this.isSimulationFinished = false;
  }

  // Simulation process

  validateShoot(): boolean {
    // Check if the shoot is OK when filled by human
    let humans = this.shooterResults.data.filter(x => !x.eliminated).filter(x => !this.isIA(x.name));
    for (const human of humans) {
      let valueToCheck = human.getScoreForAShoot(this.indexForFilling);
      if (valueToCheck !== undefined && valueToCheck !== null) {
        if (valueToCheck < ShootService.MIN_VALUE_SHOOT || valueToCheck > ShootService.MAX_VALUE_SHOOT) {
          let formattedMessage: string = this.appData.message.errors.bad_value_shoot;
          formattedMessage = MessageService.formatMessage(formattedMessage, 0, human.name);
          formattedMessage = MessageService.formatMessage(formattedMessage, 1, valueToCheck.toString());
          this.messageService.openErrorMessage(formattedMessage);
          return false;
        }
        if (!ShootService.isCorrectShoot(valueToCheck)) {
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
    this.shooterResults.data.filter(x => !x.eliminated).filter(x => this.isIA(x.name)).forEach(shooterAI => {
      shooterAI.setScoreForAShoot(this.shooterGenerator.generateShoot(), this.indexForFilling);
    });
  }

  computeTotalScores(): void {
    this.shooterResults.data.filter(x => !x.eliminated).forEach(shooter => shooter.computeTotal());
  }

  sortTrendAndRank(): void {
    // Each one of these collections have same length (8 shooters)
    let previousState: ShooterResult[] = JSON.parse(JSON.stringify(this.shooterResults.data));
    this.shooterResults.data = this.shooterResults.data.sort((s1, s2) => s2.total - s1.total);
    for (let index = 0; index < this.shooterResults.data.length; index++) {
      this.shooterResults.data[index].rank = index + 1;
      if (previousState[index].rank != null) {
        let currentRankTotal = this.shooterResults.data[index].total;
        let previousRankTotal = previousState[index].total;
        if (currentRankTotal > previousRankTotal) this.shooterResults.data[index].trend = this.trendUp;
        else if (currentRankTotal < previousRankTotal) this.shooterResults.data[index].trend = this.trendDown;
        else this.shooterResults.data[index].trend = this.trendEqual;
      }
    }
    // Elimination phase at shoots 12, 14, 16, 18, 20, 22, 24
    if (this.eliminationPhase.includes(this.indexForFilling)) {
      // Elimination phase
      let lastEliminated = this.shooterResults.data.filter(shooter => !shooter.eliminated).length - 1
      this.shooterResults.data[lastEliminated].eliminated = true;
    }
  }

  checkWinner(): void {
    // After 24 shoot (index 23) we should have a winner
    if (this.indexForFilling >= 23) {
      let winner = this.shooterResults.data.find(shooter => !shooter.eliminated);
      if (winner) {
        this.isSimulationFinished = true;
        this.dialog.open(WinnerDialogComponent, { data: { shooter: winner } });
      }
    }
  }

  validateGenerateAndGoToNextShoot(): void {
    if (this.isSimulationFinished) return;
    if (!this.validateShoot()) return;
    this.generateAIShoot();
    this.computeTotalScores();
    this.sortTrendAndRank();
    this.checkWinner();
    this.indexForFilling++;    
  }

  // Functions using Host events

  @HostListener("document:keypress", ["$event"])
  hostValidateGenerateAndGoToNextShoot(event: KeyboardEvent): void {
    // Case of enter key press
    if (event?.key === "Enter") this.validateGenerateAndGoToNextShoot();
  }

  // Utils function for this component

  formatShootColumn(shootNumber: string) {
    return `${this.appData.simulation.labels.shoot} ${shootNumber}`;
  }

  isIA(name: string): boolean {
    return name.includes(this.appData.simulation.labels.ia)
  }

  generateShooterCSSClass(shooter: ShooterResult): string[] {
    let classes = [];
    switch (shooter.rank) {
      case 1:
        classes.push('gold');
        break;
      case 2:
        classes.push('silver');
        break;
      case 3:
        classes.push('bronze');
        break;
      default:
        if (shooter.eliminated) classes.push('disabled');
        break;
    }
    return classes;
  }

}
