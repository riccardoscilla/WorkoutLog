import { NgModule } from "@angular/core";

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpeedDialModule } from 'primeng/speeddial';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  exports: [
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    CalendarModule,
    ChipModule,
    DropdownModule,
    MultiSelectModule,
    ToastModule,
    ConfirmDialogModule,
    SpeedDialModule,
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    ToggleButtonModule,
    PasswordModule,
    TooltipModule
  ]
})
export class PrimeNgModule {}