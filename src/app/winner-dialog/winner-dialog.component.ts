import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WinnerDialogData } from 'src/app/simulation-panel/simulation-panel.component';
import { LanguageService } from 'src/app/services/language.service';

export interface EntryWinnerTable {
  total: number;
  scores: number[]
}

@Component({
  selector: 'app-winner-dialog',
  templateUrl: './winner-dialog.component.html',
  styleUrls: ['./winner-dialog.component.scss']
})
export class WinnerDialogComponent implements OnInit {

  appData?: any;
  loading: boolean = true;

  constructor(
    private languageService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: WinnerDialogData
  ) {
    this.languageService.getCurrentAppData().subscribe(data => {
      this.appData = data;
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

}
