import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { FormControl, Validators } from '@angular/forms';
import { SimulationParameters, SimulationParametersService } from 'src/app/services/parameters.service';
import { NameService } from 'src/app/services/name.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  loading: boolean;
  simulationGenerated: boolean;
  appData?: any;
  categories?: Array<any>

  // Navbar Form with default values
  sexControl = new FormControl("M");
  categoryControl = new FormControl("CG");
  levelControl = new FormControl("local");
  shooterNumberControl = new FormControl(1);
  names = [new FormControl(this.nameService.getRandomMaleName(), [Validators.required, Validators.minLength(3)])];

  constructor(
    private languageService: LanguageService,
    private nameService: NameService,
    private simulationParametersService: SimulationParametersService
  ) {
    this.loading = true;
    this.simulationGenerated = false;
    this.languageService.getCurrentAppData().subscribe(data => {
      if (!LanguageService.isDefaultAppData(data)) {
        this.appData = data;
        this.categories = data.navbar.choices.category.M;
        this.loading = false;
      } else {
        this.loading = true;
      }
    });
    this.simulationParametersService.getIsCurrentSimulation().subscribe(data => {
      this.simulationGenerated = data;
      if (this.simulationGenerated) {
        this.sexControl.disable();
        this.categoryControl.disable();
        this.levelControl.disable();
        this.shooterNumberControl.disable();
        this.names.map(x => x.disable());
      } else {
        this.sexControl.enable();
        this.categoryControl.enable();
        this.levelControl.enable();
        this.shooterNumberControl.enable();
        this.names.map(x => x.enable());
      }
    });
  }

  ngOnInit(): void {}

  refreshCategoriesFromSex(evt: any): void {
    let selectedSex = evt.value;
    let currentSelectedCategory = this.categoryControl.value;
    let index = this.categories?.map(category => category.value).indexOf(currentSelectedCategory);
    this.categories = this.appData.navbar.choices.category[selectedSex];
    if (index != -1 && index !== undefined) {
      if (this.categories) this.categoryControl.setValue(this.categories[index].value);
    } else {
      if (this.categories) this.categoryControl.setValue(this.categories[0].value);
    }
  }

  refreshShooterNamesFromSex(evt: any): void {
    let selectedSex = evt.value;
    let selectedShooterNumber = this.shooterNumberControl.value;
    this.names = [];
    for (let index = 0; index < selectedShooterNumber; index++) {
      let name = (selectedSex === "M") ? this.nameService.getRandomMaleName() : this.nameService.getRandomFemaleName();
      this.names.push(new FormControl(name, [Validators.required, Validators.minLength(3)]));
    }
  }

  refreshShooterNamesFromShooterNumber(evt: any): void {
    let selectedShooterNumber = evt.value;
    let sex = this.sexControl.value;
    this.names = [];
    for (let index = 0; index < selectedShooterNumber; index++) {
      let name = (sex === "M") ? this.nameService.getRandomMaleName() : this.nameService.getRandomFemaleName();
      this.names.push(new FormControl(name, [Validators.required, Validators.minLength(3)]));
    }
  }

  createSimulation(): void {
    // Validator to see if a string is non empty
    let validateNonEmpty = (formControl: FormControl) => new Boolean(formControl.value).valueOf();
    let errorFormControlsNonEmpty = this.names.find(formControl => !validateNonEmpty(formControl));
    if (errorFormControlsNonEmpty) {
      console.log("Send error Non Empty!");
      return;
    }
    // Validate with builtin validators
    let errorFormControlsValidators = this.names.find(formControl => !formControl.valid);
    if (errorFormControlsValidators) {
      console.log("Send error Validator!");
      return;
    }
    let params = new SimulationParameters(
      this.sexControl.value,
      this.retrieveSexLabel(this.sexControl.value),
      this.categoryControl.value,
      this.retrieveCategoryLabel(this.categoryControl.value, this.sexControl.value),
      this.levelControl.value,
      this.retrieveLevelLabel(this.levelControl.value),
      this.names.map(x => x.value)
    );
    this.simulationParametersService.changeCurrentSimulationParameters(params);
    this.simulationParametersService.changeIsCurrentSimulation(true);
  }
  
  retrieveSexLabel(value: string): string {
    return this.appData.navbar.choices.sex.find((x: { value: string; }) => x.value == value).label;
  }

  retrieveCategoryLabel(value: string, sex: string): string {
    return this.appData.navbar.choices.category[sex].find((x: { value: string; }) => x.value == value).label;
  }

  retrieveLevelLabel(value: string): string {
    return this.appData.navbar.choices.level.find((x: { value: string; }) => x.value == value).label;
  }
}
