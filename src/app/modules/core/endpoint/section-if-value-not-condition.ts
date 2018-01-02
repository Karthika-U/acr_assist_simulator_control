import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';


export class SectionIfValueCondition implements Condition {
  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(value: string): boolean {
    return value !== this.conditionType.comparisonValue;
  }
}
