import { Component, OnInit } from '@angular/core';

export class SimulationPanelParameters {

  sex: string;
  category: string;
  level: string;
  names: Array<string>;

  constructor(sex: string, category: string, level: string, names: Array<string>) {
    this.sex = sex;
    this.category = category;
    this.level = level;
    this.names = names;
  }

}

@Component({
  selector: 'app-simulation-panel',
  templateUrl: './simulation-panel.component.html',
  styleUrls: ['./simulation-panel.component.scss']
})
export class SimulationPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
