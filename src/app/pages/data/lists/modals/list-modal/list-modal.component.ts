import { Component, OnInit, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ModalType } from '@app-core/enums/modal-type.enum';
import { List } from '@app-models/list';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '@app-core/services/data.service';
import { takeUntil } from 'rxjs/operators';
import { NgSelectData } from '@app-models/common';

@Component({
  selector: 'app-data-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataListModalComponent implements OnInit, OnDestroy {
  @ViewChild('listModal', { static: false }) listModal;
  @Input() modalType = ModalType.New;
  @Input() list: List;

  ModalType = ModalType;
  private unsubscribe$ = new Subject();

  form: FormGroup;
  typeList: NgSelectData[];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
  ) {
    this.form = this.fb.group({
      id: 0,
      name: ['', Validators.required],
      description: ['', Validators.required],
      folderId: ['0', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dataService.getTypeList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => {
          this.typeList = data;
        },
        error => {
          console.log('error', error.response);
        }
      );

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  show() {
    if (this.modalType === ModalType.Edit) {
      const { listId, name, description, folderId, type } = this.list;
      this.form.setValue({ id: listId, name, description, folderId: `${folderId}`, type });
    } else {
      this.form.setValue({
        id: 0,
        name: '',
        description: '',
        folderId: '0',
        type: ''
      });
    }
    setTimeout(() => this.listModal.show());
  }

  // event form submit
  onSave() {
    console.log(this.form.value);
  }

  hide() {
    this.listModal.hide();
  }
}
