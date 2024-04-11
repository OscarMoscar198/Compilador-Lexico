export default class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokenTable = [
      { regex: /func/, type: "FUNCION" },
      { regex: /for/, type: "FOR" },
      { regex: /if/, type: "IF" },
      { regex: /int|string|float|bool/, type: "TIPO_DATO" },
      { regex: /return/, type: "RETURN" },
      { regex: /else/, type: "ELSE" },
      { regex: /(<=|>=|!=|==|<|>)/, type: "OPERADOR" },
      { regex: /=/, type: "ASIGNACION" },
      { regex: /\(/, type: "PARENTESIS_ABRIR" },
      { regex: /\)/, type: "PARENTESIS_CERRAR" },
      { regex: /\{/, type: "LLAVE_ABRIR" },
      { regex: /\}/, type: "LLAVE_CERRAR" },
      { regex: /:/, type: "DOS_PUNTOS" },
      { regex: /;/, type: "PUNTO_COMA" },
      { regex: /\++/, type: "INCREMENTO" },
      { regex: /,/, type: "COMA" },
      { regex: /\./, type: "PUNTO" },
      { regex: /Print/, type: "PRINT" },  
      { regex: /[0-9]+/, type: "DIGITO" },
      { regex: /[a-zA-Z_][a-zA-Z0-9_]*/, type: "VARIABLE" },  
      { regex: /"/, type: "COMILLAS" },
    ];
  }

  getNextToken() {
    while (this.position < this.input.length) {
      let char = this.input[this.position];
      for (const tokenDef of this.tokenTable) {
        const match = this.input.slice(this.position).match(tokenDef.regex);
        if (match && match.index === 0) {
          this.position += match[0].length;
          return { type: tokenDef.type, value: match[0] };
        }
      }
      if (/\s/.test(char)) {
        this.position++;
        continue;
      }
      throw new Error(`Caracter inesperado en posición ${this.position}: '${char}'`);
    }
    return { type: "FINAL", value: null };
  }

  tokenize() {
    const tokens = [];  
    let token = this.getNextToken();
    while (token.type !== "FINAL") {
      tokens.push(token);
      token = this.getNextToken();
    }
    return tokens;
  }
}
