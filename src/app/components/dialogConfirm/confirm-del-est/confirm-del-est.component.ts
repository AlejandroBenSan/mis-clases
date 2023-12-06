import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-del-est',
  templateUrl: './confirm-del-est.component.html',
  styleUrls: ['./confirm-del-est.component.css']
})
export class ConfirmDelEstComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDelEstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
