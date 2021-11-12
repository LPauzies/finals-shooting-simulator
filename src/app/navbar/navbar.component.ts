import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { FormControl, Validators } from '@angular/forms';
import { SimulationPanelParameters } from 'src/app/simulation-panel/simulation-panel.component';
import { NameService } from 'src/app/services/name.service';
import { ThrowStmt } from '@angular/compiler';

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

  // Navbar Form
  sexControl = new FormControl("M");
  categoryControl = new FormControl("CG");
  levelControl = new FormControl("local");
  shooterNumberControl = new FormControl(1);
  names = [new FormControl(this.nameService.getRandomMaleName(), [Validators.required, Validators.minLength(3)])];

  constructor(
    private languageService: LanguageService,
    private nameService: NameService
  ) {
    this.loading = true;
    this.simulationGenerated = false;
    this.languageService.getAppData().subscribe(data => {
        this.appData = data;
        this.categories = data.navbar.choices.category.M;
        this.loading = false;
      }
    ); 
  }

  ngOnInit(): void {
  }

  refreshCategories(evt: any): void {
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

  refreshShooterNames(evt: any): void {
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
    let params = new SimulationPanelParameters(
      this.sexControl.value,
      this.categoryControl.value,
      this.levelControl.value,
      this.names.map(x => x.value)
    );
  }

}
