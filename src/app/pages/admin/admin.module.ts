import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '@app-components/datatable/datatable.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../theme/shared/shared.module';
import { SelectModule } from 'ng-select';
import { UsersComponent } from './users/users.component';
import { ArchwizardModule } from 'angular-archwizard';

// components
import { UserModalComponent } from './users/modals/user/user-modal.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    DatatableModule,
    SelectModule,
    ArchwizardModule
  ]
})
export class AdminModule { }