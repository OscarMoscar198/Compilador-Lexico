Start
  = Automatum

Automatum
  = Statement*

Statement
  = IF
  / FOR
  / FUNCION
  / VARIABLEINT
  / VARIABLEFLOAT
  / VARIABLESTRING
  / VARIABLEBOOL
  / PRINT

CONTENIDO
  = IF
  / FOR
  / FUNCION
  / VARIABLEINT
  / VARIABLEFLOAT
  / VARIABLESTRING
  / VARIABLEBOOL
  / CONT
  / PRINT

PRINT
  = "Print" _ "(" _ argument:Argumento _ ")" { return { type: "Print", argument: argument }; }

CONT
  = "CONTENIDO"

VARIABLEINT
  = "int" _ IDENTIFICADOR _ "=" _ DIGITO _ CONTENIDO?

VARIABLEBOOL
  = "bool" _ IDENTIFICADOR _ "=" _ BOOL _ CONTENIDO?

VARIABLEFLOAT
  = "float" _ IDENTIFICADOR _ "=" _ DIGITO "." DIGITO _ CONTENIDO?

VARIABLESTRING
  = "string" _ IDENTIFICADOR _ "=" _ "\"" STRING "\"" _ CONTENIDO?

IF
  = "if" _ "(" _ IDENTIFICADOR _ OPERADOR _ DIGITO _ ")" _ "{" _ CONTENIDO _ "}" _ "else" _ "{" _ CONTENIDO _ "}"

FOR
  = "for" _ "(" _ CONTADOR _ ")" _ "{" _ CONTENIDO _ "}"

FUNCION
  = "func" _ IDENTIFICADOR _ "(" _ Parametros? _ ")" _ "{" _ "return" _ CONTENIDO _ "}"

Parametros
  = IDENTIFICADOR ( _ "," _ IDENTIFICADOR _ )*

STRING
  = [a-zA-Z_][a-zA-Z0-9_]*

BOOL
  = "true" 
  / "false" 

CONTADOR
  = "i" _ OPERADOR _ DIGITO _ ";" _ "i" _ OPERADOR _ DIGITO _ ";" _ "i" _ INCREMENTO

INCREMENTO
  = "++"

IDENTIFICADOR
  = [a-zA-Z_][a-zA-Z0-9_]*

OPERADOR
  = ">"
  / "<"
  / ">="
  / "<="
  / "=="
  / "!="
  / "=<"
  / "=>"

DIGITO
  = [0-9]+ { return parseInt(text(), 10); }

_ "espacio"
  = [ \t\n\r]* { return null; }

Argumento
  = String / Numero  // Nueva definición para aceptar strings y números

String
  = "\"" chars:[^"]* "\"" { return chars.join(""); }  // Definición para capturar strings en comillas

Numero
  = [0-9]+ { return parseInt(text(), 10); }  // Definición para capturar números
