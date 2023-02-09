import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from "@angular/material/list"
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPromptComponent } from "./confirmation-prompt/confirmation-prompt.component";

@NgModule({
    declarations: [
        AlertComponent,
        ConfirmationPromptComponent,
        LoadingSpinnerComponent
    ],
    imports: [
        MatButtonModule
    ],
    exports: [
        CommonModule,
        AlertComponent,
        ConfirmationPromptComponent,
        LoadingSpinnerComponent,
        MatButtonModule, 
        MatCardModule, 
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSortModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        NgbCarouselModule
    ],
    providers: [ MatDatepickerModule ]
})
export class SharedModule {}
