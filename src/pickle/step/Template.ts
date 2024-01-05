import { StepRegex, HandlerFunction } from "../types"

class Step {
    public StepsRegex: RegExp[]; 
    public StepFunction: HandlerFunction;

    constructor(StepsRegex: RegExp[], StepFunction: HandlerFunction) {
        this.StepsRegex = StepsRegex;
        this.StepFunction = StepFunction;
    }

    public stepMatch(gherkin: string): String[]|null {
        for (let i = 0; i < this.StepsRegex.length; i++) {
            if (this.StepsRegex[i].test(gherkin)) {
                return gherkin.match(this.StepsRegex[i]); 
            }
        }
        return null;
    }
}

export default Step