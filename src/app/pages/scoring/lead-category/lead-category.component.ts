import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LeadCategory } from '@app-core/models/scoring';
import { DataTableSource, DataTableColumn } from '@app-components/datatable/datatable-source';
import { ScoringService } from '@app-core/services/scoring.service';
import { ModalService } from '@app-components/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { LeadCategoryModalComponent } from './lead-category-modal/lead-category-modal.component';
import { ScoringConfirmDefaultModalComponent } from '../components/scoring-confirm-default-modal/scoring-confirm-default-modal.component';

@Component({
  selector: 'app-lead-category',
  templateUrl: './lead-category.component.html',
  styleUrls: ['./lead-category.component.scss']
})
export class LeadCategoryComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('confirmModal', { static: false }) confirmModal;

  destroy$ = new Subject();
  leadCategoryData: LeadCategory[];
  selected: LeadCategory[];

  tableSource: DataTableSource<LeadCategory> = new DataTableSource<LeadCategory>(50);
  tableButtons = [
    { label: 'Create', icon: 'fa fa-plus', click: () => this.onClickCreate() },
    { label: 'Delete', icon: 'fa fa-trash', click: () => this.onDeleteClicked(), color: 'red', hide: true }
  ];

  constructor(
    private scoringService: ScoringService,
    private modalService: ModalService
  ) {
    this.leadCategoryData = [];
  }

  ngOnInit(): void {
    this.scoringService.getLeadCategoryMockData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.leadCategoryData = data;
        },
        error => {
          console.log('error', error);
        }
      );

    this.tableSource.changed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(change => {
        let mockData = [];
        if (change.search) {
          mockData = this.leadCategoryData.filter(item =>
            item.name.includes(change.search) || item.criteria.includes(change.search));
        } else {
          mockData = this.leadCategoryData;
        }

        this.tableSource.next(
          mockData.slice(
            change.pagination.pageSize * (change.pagination.pageNumber - 1), change.pagination.pageSize * (change.pagination.pageNumber)),
          mockData.length
        );
      });

    this.tableSource.selection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selected => {
        this.selected = selected;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit(): void {
    const columns: DataTableColumn[] = [
      { name: 'ID', prop: 'id', sortable: true, cellClass: ['cell-hyperlink'], alwaysVisible: true },
      { name: 'Name', prop: 'name', sortable: true },
      { name: 'Criteria', prop: 'criteria', sortable: true }
    ];
    this.tableSource.setColumns(columns);
  }

  onClickCreate() {
    this.modalService.openModal(LeadCategoryModalComponent, {
      width: '100%',
      data: {
        createMode: true
      }
    });
  }

  onDeleteClicked() {
    this.modalService.openModal(ScoringConfirmDefaultModalComponent, {
      width: '400px',
      data: {
        message: 'Are you sure you want to delete selected Lead Category/s?'
      }
    });
  }

  onActive(event) {
    if (event.type === 'click' && event.cellIndex === 1 && event.event.target.classList.value === 'datatable-body-cell-label') {
      const leadCategory = event.row as LeadCategory;
      this.modalService.openModal(LeadCategoryModalComponent, {
        width: '100%',
        data: {
          leadCategory,
          createMode: false
        }
      });
    }

    if (event.type === 'checkbox') {
      this.tableButtons[1].hide = this.selected.length === 0;
    }
  }
}
