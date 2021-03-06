import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LeadCardComponent } from '../lead-card/lead-card.component';

@Component({
  selector: 'app-rule-template',
  templateUrl: './rule-template.component.html',
  styleUrls: ['./rule-template.component.scss']
})
export class RuleTemplateComponent implements OnInit {

  public uniqueKey: number;
  public parentRef: LeadCardComponent;

  formGroup: FormGroup;


  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      description: '',
      condition: '',
      value: '',
      points: 0
    });
  }

  remove_me() {
    this.parentRef.remove(this.uniqueKey);
  }
}
