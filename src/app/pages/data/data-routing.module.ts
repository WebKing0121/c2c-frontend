import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRecordsComponent } from './manage-records/manage-records.component';
import { ListsComponent } from './lists/lists.component';

const routes: Routes = [
  {
    path: 'manage-records/:type',
    component: ManageRecordsComponent
  },
  {
    path: 'lists',
    component: ListsComponent
  },
  {
    path: '**',
    redirectTo: 'manage-records/all'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
