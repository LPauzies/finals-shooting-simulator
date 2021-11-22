import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimulationParameters, SimulationParametersService } from 'src/app/services/parameters.service';

@Component({
  selector: 'app-simulation-panel',
  templateUrl: './simulation-panel.component.html',
  styleUrls: ['./simulation-panel.component.scss']
})
export class SimulationPanelComponent implements OnInit {

  isSimulationGenerated: boolean;
  simulationSubscription: Subscription;
  simulationParameters?: SimulationParameters;

  constructor(
    private simulationParametersService: SimulationParametersService
  ) {
    this.isSimulationGenerated = false;
    this.simulationSubscription = this.simulationParametersService.getCurrentSimulationParameters().subscribe(params => {
      if (!params.isDefault()) {
        this.simulationParameters = params;
        this.isSimulationGenerated = true;
      } else {
        this.isSimulationGenerated = false;
      }
      
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.simulationSubscription.unsubscribe();
  }

}
