const util = require("util");

function filter(element, structure) {
    if (typeof structure === "string") return filterFields(element, structure);
    if (typeof structure === "object") return filterElement(element, structure);
    throw new Error("Invalid structure! Cannot filter element.");
}

function filterFields(object, fields) {
    fields = fields.split(" ");
    const filteredObject = {};
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        filteredObject[field] = object[field];
    }
    return filteredObject;
}

function filterElement(
    element,
    structure,
    options = { returnUndefined: false, strictArrays: true }
) {
    try {
        if (element instanceof Array) {
            if (!(structure instanceof Array)) return undefined;
            let filteredArray = [...element];
            const innerStructure = structure[0];
            if (innerStructure) {
                filteredArray = filteredArray
                    .map((item) =>
                        filterElement(item, innerStructure, {
                            returnUndefined: true,
                            strictArrays: options.strictArrays,
                        })
                    )
                    .filter((item) => item !== undefined);
            } else if (options.strictArrays) {
                filteredArray = filteredArray.filter(
                    (item) => !(item instanceof Object)
                );
            }
            if (filteredArray.length === 0 && options.returnUndefined)
                return undefined;
            return filteredArray;
        }
        if (element instanceof Object) {
            const filteredObject = {};
            const structureKeys = Object.keys(structure);

            for (let i = 0; i < structureKeys.length; i++) {
                const structureKey = structureKeys[i];
                const elementValue = element[structureKey];
                const structureValue = structure[structureKey];

                if (!elementValue) continue;

                if (typeof structureValue === "number") {
                    if (structureValue === 1)
                        Object.assign(filteredObject, {
                            [structureKey]: elementValue,
                        });
                } else if (structureValue instanceof Array) {
                    if (!(elementValue instanceof Array)) return undefined;
                    const filteredArray = filterElement(
                        elementValue,
                        structureValue,
                        {
                            returnUndefined: true,
                            strictArrays: options.strictArrays,
                        }
                    );
                    if (filteredArray)
                        Object.assign(filteredObject, {
                            [structureKey]: filteredArray,
                        });
                } else if (structureValue instanceof Object) {
                    const newObj = filterElement(elementValue, structureValue, {
                        returnUndefined: true,
                        strictArrays: options.strictArrays,
                    });
                    if (newObj !== undefined)
                        Object.assign(filteredObject, {
                            [structureKey]: filterElement(
                                elementValue,
                                structureValue,
                                {
                                    returnUndefined: true,
                                    strictArrays: options.strictArrays,
                                }
                            ),
                        });
                }
            }
            if (
                Object.keys(filteredObject).length === 0 &&
                options.returnUndefined
            ) {
                return undefined;
            }
            return filteredObject;
        }
        return undefined;
    } catch (err) {
        console.error(err);
        throw new Error("Invalid filter structure");
    }
}

module.exports = filter;
