import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';

export class LessThanCondition implements Condition {
  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }
  evaluate(value: any): boolean {
    return value < this.conditionType.comparisonValue;
  }

}
