import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    static DEFAULT_DURATION_MESSAGE = 5000;

    constructor(
        private snackBar: MatSnackBar
    ) {}

    openMessage(message: string) {
        this.snackBar.open(message, "OK", { duration: MessageService.DEFAULT_DURATION_MESSAGE });
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