import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(
        private snackBar: MatSnackBar
    ) {}

    openMessage(message: string) {
        this.snackBar.open(message, "OK");
    }

    openErrorMessage(message: string) {
        this.openMessage(`❌ ${message} ❌`);
    }

    openWarningMessage(message: string) {
        this.openMessage(`⚠️ ${message} ⚠️`);
    }

    openInfoMessage(message: string) {
        this.openMessage(`ℹ️ ${message} ℹ️`);
    }

    openSuccessMessage(message: string) {
        this.openMessage(`✔️ ${message} ✔️`);
    }

    static formatMessage(message: string, position: number, replacementString: string): string {
        let regexPattern = `!${position}`;
        const regex = new RegExp(regexPattern, "g");
        return message.replace(regex, replacementString);
    }

}