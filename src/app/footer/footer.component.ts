import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import AppJson from 'src/assets/data/app.json';
import { LanguageCookieService } from 'src/app/services/cookie.service';
import { TcuDialogComponent } from 'src/app/tcu-dialog/tcu-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  owner: any;
  technical: any;
  app: any;

  constructor(
    private languageCookieService: LanguageCookieService,
    public dialog: MatDialog
    ) {
    this.owner = AppJson.owner;
    this.technical = AppJson.technical;
    this.app = AppJson.app;
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
