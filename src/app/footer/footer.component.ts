import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import AppJson from 'src/assets/data/app.json';
import { TcuDialogComponent } from 'src/app/tcu-dialog/tcu-dialog.component';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  loading: boolean;
  owner: any;
  technical: any;
  app: any;
  appData?: any;

  constructor(
    private languageService: LanguageService,
    public dialog: MatDialog
    ) {
    this.loading = true;
    this.owner = AppJson.owner;
    this.technical = AppJson.technical;
    this.app = AppJson.app;
    this.languageService.getAppData().subscribe(data => {
      this.appData = data.footer;
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

  getTCUDialogWidth(): number {
    return window.innerWidth / 2;
  }

  openTCUDialog(): void {
    let width = `${this.getTCUDialogWidth()}px`
    this.dialog.open(TcuDialogComponent, {
      width: width
    });
  }

}
