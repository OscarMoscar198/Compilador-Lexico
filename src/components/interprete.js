function interpret(ast) {
    const context = {
        variables: new Map(),
        functions: new Map()
    };

    ast.forEach(node => {
        if (node.type === 'FUNCION') {
            context.functions.set(node.identifier, node);
        }
    });

    ast.forEach(node => {
        if (node.type === 'FUNCION') {
            executeFunction(node, context);
        }
    });
}

function executeFunction(funcNode, context) {
    console.log(`Ejecutando función: ${funcNode.identifier}`);
    funcNode.body.forEach(statement => {
        executeStatement(statement, context);
    });
}

function executeStatement(statement, context) {
    switch (statement.type) {
        case 'VARIABLEINT':
        case 'VARIABLEFLOAT':
        case 'VARIABLESTRING':
        case 'VARIABLEBOOL':
            executeDeclaration(statement, context);
            break;
        case 'PRINT':
            executePrint(statement, context);
            break;
        case 'IF':
            executeIf(statement, context);
            break;
        case 'FOR':
            executeFor(statement, context);
            break;
        default:
            console.log("Tipo de sentencia no reconocido:", statement.type);
    }
}

function executeDeclaration(declaration, context) {
    if (!context.variables.has(declaration.identifier)) {
        context.variables.set(declaration.identifier, declaration.value);
        console.log(`Variable declarada: ${declaration.identifier} = ${declaration.value}`);
    } else {
        console.error(`Error: Variable duplicada ${declaration.identifier}`);
    }
}

function executePrint(printStmt, context) {
    console.log("Impresión:", printStmt.argument);
}

function executeIf(ifStmt, context) {
    let condition = evaluateCondition(ifStmt.condition, context);
    if (condition) {
        console.log(`Condición verdadera, ejecutando bloque if.`);
        ifStmt.trueBody.forEach(statement => {
            executeStatement(statement, context);
        });
    } else {
        console.log(`Condición falsa, ejecutando bloque else.`);
        ifStmt.falseBody.forEach(statement => {
            executeStatement(statement, context);
        });
    }
}

function evaluateCondition(condition, context) {
    let leftValue = context.variables.get(condition.left) || condition.left;
    let rightValue = context.variables.get(condition.right) || condition.right;
    return compare(leftValue, condition.operator, rightValue);
}

function compare(left, operator, right) {
    switch (operator) {
        case '<=':
        case '=<':
            return left <= right;
        case '>=':
        case '=>':
            return left >= right;
        case '==':
            return left === right;
        case '!=':
            return left !== right;
        case '<':
            return left < right;
        case '>':
            return left > right;
        default:
            throw new Error(`Operador desconocido: ${operator}`);
    }
}

function executeFor(forStmt, context) {
    const start = context.variables.get(forStmt.counter.start) || forStmt.counter.start;
    const end = context.variables.get(forStmt.counter.end) || forStmt.counter.end;
    const step = forStmt.counter.increment === '++' ? 1 : -1;

    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
        forStmt.body.forEach(statement => {
            executeStatement(statement, context);
        });
    }
}

export { interpret };
