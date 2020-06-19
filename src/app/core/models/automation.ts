import { AutomationType } from '@app-core/enums/automation-type.enum';

export class Automation {
  id: number;
  name: string;
  description: string;
  type: AutomationType | string;
  status: string;
  updated: string;
  created: string;
}