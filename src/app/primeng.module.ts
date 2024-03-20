import { NgModule } from "@angular/core";

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';

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
    TooltipModule,
    CheckboxModule,
    RadioButtonModule,
    BreadcrumbModule,
    ListboxModule,
    TabViewModule
  ]
})
export class PrimeNgModule {}