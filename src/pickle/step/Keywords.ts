const patterns: Record<string, string> = {
    "{string}": "'([^']*)'",    
    "{bool}": "(true|false)",   
    "{int}": "(\\d+)"           
};

function gherkinToRegex(step: string): RegExp {
    let regexStr = step;
    for (const [placeholder, regex] of Object.entries(patterns)) {
        regexStr = regexStr.replace(new RegExp(placeholder, 'g'), regex);
    }
    return new RegExp(`^${regexStr}$`)
}

export const Given = (step: string): RegExp => {
    return gherkinToRegex('Given ' + step)
}

export const Then = (step: string): RegExp => {
    return gherkinToRegex('Then ' + step)
}

export const When = (step: string): RegExp => {
    return gherkinToRegex('When ' + step)
}

export const And = (step: string): RegExp => {
    return gherkinToRegex('And ' + step)
}