import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CampaignFromDisplayType } from '@app-core/enums/campaign-type.enum';
import { ModalService } from '@app-components/modal/modal.service';
import { Campaign } from '@app-models/campaign';
import { CampaignResponseMockData } from '@app-fake-db/campaign-mock';
import { CampaignSendModalComponent } from '../components/campaign-send-modal/campaign-send-modal.component';
import { MODAL_DATA, ModalRef } from '@app-components/modal/modal-ref';

interface ComponentProps {
  id: string;
  mode: string;
}

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {
  CampaignFromDisplayType = CampaignFromDisplayType;

  campaign: Campaign;
  campaignMode: 'new' | 'edit';

  formGroup: FormGroup;
  fullScreen: boolean;
  modalClass: string;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    @Inject(MODAL_DATA) private props: ComponentProps,
    @Inject(ModalRef) private modalRef: ModalRef<CampaignComponent>,
  ) {
    this.fullScreen = false;
    this.modalClass = 'campaign-modal';
  }

  ngOnInit(): void {
    // const { id } = this.route.snapshot.params;
    // const { mode } = this.route.snapshot.data;
    const id = this.props.id;
    const mode = this.props.mode;

    const data = CampaignResponseMockData.find(d => d.id === id);
    this.campaign = data;
    this.campaignMode = mode === 'new' ? 'new' : 'edit';

    this.formGroup = this.fb.group({
      name: data && data.name,
      subject: data && data.subject,
      fromDisplay: '',
      fromAddress: data && data.fromAddress,
      replyAddress: data && data.replyAddress,
      folderName: '',
      emailContent: ''
    });

    if (this.campaignMode === 'new') {
      this.formGroup.controls.name.setValidators(Validators.required);
      this.formGroup.controls.name.updateValueAndValidity();

      this.formGroup.controls.subject.setValidators(Validators.required);
      this.formGroup.controls.subject.updateValueAndValidity();

      this.formGroup.controls.emailContent.setValidators(Validators.required);
      this.formGroup.controls.emailContent.updateValueAndValidity();
    }

  }

  onSave() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onCancel() {
    this.modalRef.cancel();
  }

  sendEmail(mode: 'full' | 'test') {
    if (!this.campaign) {
      return;
    }

    this.modalService.openModal(CampaignSendModalComponent, {
      width: '80%',
      data: {
        campaign: null,
        mode
      }
    });
  }

  revertFullScreen() {
    this.fullScreen = !this.fullScreen;
    this.modalClass = 'campaign-modal' + (this.fullScreen ? ' full-screen' : '');
  }
}
