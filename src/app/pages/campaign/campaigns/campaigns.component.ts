import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Campaign } from '@app-models/campaign';
import { CampaignType } from '@app-core/enums/campaign-type.enum';
import { DataTableColumn, DataTableSource } from '@app-components/datatable/datatable-source';
import { ModalService } from '@app-components/modal/modal.service';

import { CampaignResponseMockData } from '@app-fake-db/campaign-mock';
import { DateFormatPipe } from '../../../theme/shared/pipes/date-format.pipe';
import { CampaignSendModalComponent } from '../components/campaign-send-modal/campaign-send-modal.component';
// tslint:disable-next-line
import { ScoringConfirmDefaultModalComponent } from '../../scoring/components/scoring-confirm-default-modal/scoring-confirm-default-modal.component';
import { CampaignComponent } from '../campaign/campaign.component';
import { MobileCampaignComponent } from '../../mobile/mobile-campaign/mobile-campaign.component';
import { DataSourceChange } from '@app-models/data-source';
import { CampaignService } from '@app-core/services/campaign.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit, OnDestroy, AfterViewInit {
  CampaignType = CampaignType;

  @ViewChild('tableColumnSettings') tableColumnSettingsTemplate: TemplateRef<any>;
  @ViewChild('tableColumnType') tableColumnTypeTemplate: TemplateRef<any>;
  @ViewChild('confirmModal', { static: false }) confirmModal;

  tableSource: DataTableSource<Campaign> = new DataTableSource<Campaign>(50);
  tableButtons = [
    {
      label: 'Create', icon: 'fa fa-plus', click: () => this.clickTemplate(),
      childs: [
        { label: 'Email Campaign', icon: 'fa fa-email', click: () => this.onCampaignTypeClicked(CampaignType.Email) },
        { label: 'Mobile Campaign', icon: 'fa fa-email', click: () => this.onCampaignTypeClicked(CampaignType.SMS) },
        { label: 'Social Campaign', icon: 'fa fa-email', click: () => this.onCampaignTypeClicked(CampaignType.Social) },
        { label: 'Google Ads Campaign', icon: 'fa fa-email', click: () => this.onCampaignTypeClicked(CampaignType.GoogleAds) },
        { label: 'Facebook Ads Campaign', icon: 'fa fa-email', click: () => this.onCampaignTypeClicked(CampaignType.Facebook) },
      ]
    },
    { label: 'Delete', icon: 'fa fa-trash', click: () => this.onDeleteClicked(), color: 'red', disabled: true, hide: false },
    { label: 'Send Campaign', icon: 'far fa-envelope', click: () => this.onSendClicked(), disabled: true, hide: false },
  ];
  campaigns: Campaign[] = [];
  totalCount = 0;

  loading = false;
  selected: Campaign[] = [];
  searchFormControl: FormControl;

  destroy$ = new Subject();

  // confirm Modal
  confirmButtons = [
    { label: 'Yes', action: this.onDeleteClicked.bind(this), class: 'btn-primary' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private modalService: ModalService
  ) { }

  clickTemplate() {

  }

  ngOnInit(): void {
    this.initTable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    const columns: DataTableColumn[] = [
      { name: 'Name', prop: 'name', sortable: true, cellClass: ['cell-hyperlink'], alwaysVisible: true },
      { name: 'Subject', prop: 'subject', sortable: true },
      { name: 'Type', prop: 'campaignType', sortable: true, maxWidth: 90 },
      {
        name: 'Modification Date', prop: 'lastModificationTime', sortable: true,
        pipe: { pipe: new DateFormatPipe(), args: 'MMM, DD, YYYY hh:mm A' }
      },
      {
        name: 'Created Date', prop: 'creationTime', sortable: true,
        pipe: { pipe: new DateFormatPipe(), args: 'MMM, DD, YYYY hh:mm A' }
      },
      {
        name: 'Last Sent', prop: 'lastSent', sortable: true,
        pipe: { pipe: new DateFormatPipe(), args: 'MMM, DD, YYYY hh:mm A' }
      },
      {
        name: 'Scheduled', prop: 'scheduled', sortable: true,
        pipe: { pipe: new DateFormatPipe(), args: 'MMM, DD, YYYY hh:mm A' }
      }
    ];
    this.tableSource.setColumns(columns);
  }

  onActive(event) {
    if (
      event.type === 'click' && event.cellIndex === 1
      && event.event.target.classList.value === 'datatable-body-cell-label'
    ) {
      const campaign = event.row as Campaign;
      switch (campaign.campaignType.toLowerCase()) {
        case CampaignType.Email: {
          // this.router.navigate([campaign.id], { relativeTo: this.route });
          this.modalService.openModal(CampaignComponent, {
            width: '100%',
            data: {
              mode: 'edit',
              id: campaign.id
            }
          });
          return;
        }
        case CampaignType.SMS: {
          // this.router.navigate(['mobile', campaign.id]);
          this.modalService.openModal(MobileCampaignComponent, {
            width: '100%',
            data: {
              mode: 'edit',
              id: campaign.id
            }
          });
          return;
        }
      }
    }

    if (event.type === 'checkbox') {
      this.tableButtons[1].disabled = this.selected.length === 0;
      this.tableButtons[2].disabled = this.selected.length !== 1;
    }
  }

  onCampaignTypeClicked(type: CampaignType) {
    switch (type) {
      case CampaignType.Email: {
        // this.router.navigate(['new-email'], { relativeTo: this.route });
        this.modalService.openModal(CampaignComponent, {
          width: '100%',
          data: {
            mode: 'new'
          }
        });
        return;
      }
      case CampaignType.SMS: {
        // this.router.navigate(['mobile', 'new-campaign']);
        this.modalService.openModal(MobileCampaignComponent, {
          width: '100%',
          data: {
            mode: 'new'
          }
        });
        return;
      }
      case CampaignType.Social: {
        return;
      }
      case CampaignType.GoogleAds: {
        this.router.navigate(['advertising', 'google-ads']);
        return;
      }
      case CampaignType.Facebook: {
        this.router.navigate(['advertising', 'facebook-ads']);
        return;
      }
    }
  }

  onDeleteClicked() {
    // this.modalService.openModal(ScoringConfirmDefaultModalComponent, {
    //   width: '400px',
    //   data: {
    //     message: 'Are you sure you want to delete campaign/s?'
    //   }
    // });
    this.confirmModal.show();
  }

  onSendClicked() {
    if (this.selected.length < 1) {
      return;
    } else {
      this.modalService.openModal(CampaignSendModalComponent, {
        width: '100%',
        data: {
          campaign: this.tableSource.selected[0]
        }
      });
    }
  }

  initTable() {
    this.tableSource.changed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((change: DataSourceChange) => {
        if (change.pagination !== 'totalCount') {
          this.loadTableData();
        }
      });
    this.tableSource.selection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selected => {
        this.selected = selected;
      });
  }

  loadTableData() {
    const params = {
      SortDirection: 'Ascending',
      maxResultCount: this.tableSource.pageSize,
      skipCount: (this.tableSource.currentPage - 1) * this.tableSource.pageSize,
      sorting: '',
    };
    this.loading = true;
    this.campaignService.getCampaigns(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          if (data.result) {
            this.campaigns = data.result.items;
            this.totalCount = data.result.totalCount;
          } else {
            this.campaigns = [];
            this.totalCount = 0;
          }
          this.tableSource.next(this.campaigns, this.totalCount);
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.log('error', error.response);
        }
      );
  }
}
