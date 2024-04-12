import { useState } from "react";
import Monaco from "@monaco-editor/react";
import "./styles.css";
import Lexer from "../components/Lexer";
import { parse } from "../../gramatica.js";
import { interpret } from "../components/interprete.js";
import { analyzeSemantics } from '../components/semantica.js';

function Home() {
  const [codigo, setCodigo] = useState("");
  const [resul, setResul] = useState([]);
  const [esValido, setEsValido] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [interpretationResult, setInterpretationResult] = useState('');

  function handleValidarClick() {
    analizarCodigo();
  }

  function captureConsoleLogs(func) {
    const originalConsoleLog = console.log;
    let logs = '';
    try {
        console.log = (...args) => {
            logs += args.join(' ') + '\n';
        };
        func();  // Ejecutar la función que podría imprimir en consola.
    } finally {
        console.log = originalConsoleLog;  // Restaurar console.log, sin importar qué pase.
    }
    return logs;
}


  const analizarCodigo = () => {
    const lexer = new Lexer(codigo);
    let tokens = [];
    let error = null;

    try {
      // Lexical analysis
      let token = lexer.getNextToken();
      while (token.type !== 'FINAL') {
        tokens.push(token);
        token = lexer.getNextToken();
      }

      // Syntactic analysis
      const ast = parse(codigo);

      // Semantic analysis
      const { errors: semanticErrors } = analyzeSemantics(ast);
      if (semanticErrors.length > 0) {
        throw new Error(semanticErrors.join(', '));
      }

      // Interpretation
      const interpretationLogs = captureConsoleLogs(() => interpret(ast));
      setInterpretationResult(interpretationLogs);

      // Update UI for valid code
      setEsValido(true);
    } catch (err) {
      setEsValido(false);
      error = `Error en la posición ${lexer.position}: ${err.message}`;
      setInterpretationResult('');
    }

    setResul(tokens.map((token) => `${token.type}: ${token.value}`));
    setErrorMessage(error);
    
    console.log(interpretationResult);
  };

  function setEditorTheme(monaco) {
    monaco.editor.defineTheme("automatum", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#286492",
        "editor.lineHighlightBackground": "#FFFFFF0F",
      },
    });
  }

  return (
    <>
      <div className="title">
        <h1>AUTOMATUM 2.0</h1>
        <h2>OSCAR JAVIER CASTAÑEDA SOLIS - 213447</h2>
        <h2>AXEL GIOVANNI REYES RAMOS - 213370</h2>
      </div>
      <div className="area">
        <Monaco
          beforeMount={setEditorTheme}
          width="800"
          height="50vh"
          theme="automatum"
          value={codigo}
          options={{
            selectOnLineNumbers: false,
            mouseStyle: "text",
            acceptSuggestionOnEnter: "off",
            quickSuggestions: false,
          }}
          onChange={(newValue) => setCodigo(newValue)}
        />
        <div className="line-validator">
          <button onClick={handleValidarClick}>Validar</button>
          {esValido !== null && (
            <p>{esValido ? ' ES VALIDO' : ' NO ES VALIDO'}
              {esValido === false && errorMessage && <span className="error-message">{errorMessage}</span>}
            </p>
          )}
        </div>
      </div>
      <div className="result-list">  
       <h2>TOKENS:</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {resul.map((info, index) => (
              <tr key={index}>
                <td>{info.split(":")[0]}</td>
                <td>{info.split(":")[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {interpretationResult && (
          <div>
            <h3>Resultado de la Interpretación:</h3>
            <pre>{interpretationResult}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
