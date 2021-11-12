import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-tcu-dialog',
  templateUrl: './tcu-dialog.component.html',
  styleUrls: ['./tcu-dialog.component.scss']
})
export class TcuDialogComponent implements OnInit {

  loading: boolean;
  appData?: any;

  constructor(
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<TcuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loading = true;
    this.languageService.getAppData().subscribe(data => {
      this.appData = data;
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }



}
