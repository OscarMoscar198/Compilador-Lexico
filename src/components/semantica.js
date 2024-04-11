function analyzeSemantics(ast) {
    let errors = [];
    let functionsStatus = new Map();

    ast.forEach(statement => {
        if (statement.type === "FUNCION") {
            const functionName = statement.identifier;
            let localVariablesStatus = new Map();

            if (functionsStatus.has(functionName)) {
                errors.push(`Error Semántico: Nombre de función duplicado '${functionName}'`);
            } else {
                functionsStatus.set(functionName, { variables: localVariablesStatus });

                statement.body.forEach(content => {
                    if (["VARIABLEINT", "VARIABLEFLOAT", "VARIABLESTRING", "VARIABLEBOOL"].includes(content.type)) {
                        const variable = content.identifier;
                        if (localVariablesStatus.has(variable)) {
                            errors.push(`Error Semántico: Variable duplicada '${variable}' dentro de la función ${functionName}`);
                        } else {
                            localVariablesStatus.set(variable, {
                                initialized: true,
                                read: false,
                                type: content.type.replace("VARIABLE", "").toLowerCase()
                            });
                        }
                    } else if (content.type === "IF" || content.type === "FOR") {
                        verifyVariableDeclared(content.variable, localVariablesStatus, errors, functionName, content.type);
                        if (content.type === "FOR" && content.variable === content.limit) {
                            errors.push(`Error Semántico: Uso de la misma variable '${content.variable}' como contador y límite en el bucle 'for' en la función ${functionName}`);
                        }
                    }
                });
            }
        }
    });

    return { errors, variablesStatus: functionsStatus }; 
}

function verifyVariableDeclared(variable, localVariablesStatus, errors, functionName, contentType) {
    if (!localVariablesStatus.has(variable)) {
        errors.push(`Error Semántico: Intento de usar la variable no declarada '${variable}' en '${contentType}' en la función ${functionName}`);
    } else {
        let varStatus = localVariablesStatus.get(variable);
        varStatus.read = true; // Marks that the variable was read.
    }
}

export { analyzeSemantics };
