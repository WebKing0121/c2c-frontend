import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DatatableModule } from '@app-components/datatable/datatable.module';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '../../theme/shared/shared.module';
import { SelectModule } from 'ng-select';
import {
  NgbProgressbarModule,
  NgbDatepickerModule, NgbButtonsModule,
  NgbDropdownModule, NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

import { EventsComponent } from './events/events.component';

@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    SharedModule,
    DatatableModule,
    SelectModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    EventsRoutingModule,
  ]
})
export class EventsModule { }