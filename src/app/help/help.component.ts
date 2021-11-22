import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  loading: boolean;
  appData?: any;
  

  constructor(
    private languageService: LanguageService,
  ) {
    this.loading = true;
    this.languageService.getCurrentAppData().subscribe(data => {
      if (!LanguageService.isDefaultAppData(data)) {
        this.appData = data.help;
        this.loading = false;
      } else {
        this.loading = true;
      }
    });
  }

  ngOnInit(): void {
  }

}
