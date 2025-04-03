import Mapping from "./mapping.json"

const fieldNames: Record<string, string> = Mapping;

export function formatErrorMessage(errorObj: Record<string, any>, errVar?: Record<string, string>) {
    let errorMessages: string[] = [];
    let subKeyErrors: Record<string, string[]> = {};
    let count = 1;
    let optionalVariable: Record<string, string> = {};

    if (errVar) {
        optionalVariable = errVar;
    } else {
        optionalVariable = fieldNames;
    }
    if (typeof errorObj.detail === "string") {
        errorMessages.push(errorObj.detail);
    }
    for (const key in errorObj) {
        if (key === "detail") continue;
        if (Array.isArray(errorObj[key]) && errorObj[key].length > 0) {
            if (typeof errorObj[key][0] === "string") {
                let formattedKey = optionalVariable[key] || key;
                errorMessages.push(`${count}. ${formattedKey} - ${errorObj[key][0]}.`);
                count++;
            } else if (errorObj[key].some(item => typeof item === "object" && item !== null)) {
                errorObj[key].forEach((item: Record<string, any>, index: number) => {
                    for (const subKey in item) {
                        if (Array.isArray(item[subKey]) && item[subKey].length > 0) {
                            let formattedSubKey = optionalVariable[subKey] || subKey;

                            if (!subKeyErrors[formattedSubKey]) {
                                subKeyErrors[formattedSubKey] = [];
                            }
                            item[subKey].forEach((error: string) => {
                                subKeyErrors[formattedSubKey].push(error);
                            });
                        }
                    }
                });
                for (const subKey in subKeyErrors) {
                    errorMessages.push(`${count}. Items:`);
                    subKeyErrors[subKey].forEach((error, idx) => {
                        errorMessages.push(` S.No ${idx + 1}. ${subKey} -  ${error}`);
                    });
                    count++;
                }
            }
        }
    }

    return errorMessages.join("\n");
}
