import { useState, useEffect } from "react";
import "./App.css";
import Background from "./assets/Background";

const MOVIMENTO_DO_CAVALO = [
  [-2, -1], [-2, 1],
  [-1, -2], [-1, 2],
  [1, -2], [1, 2],
  [2, -1], [2, 1]
];

function App() {
  const [mostrarIntro, setMostrarIntro] = useState(true);
  const [mostrarInputInicio, setMostrarInputInicio] = useState(false);
  const [mostrarInput, setMostrarInput] = useState(false);

  const [tamanho, setTamanho] = useState(0);
  const [tabuleiro, setTabuleiro] = useState([]);

  const [linhaAtual, setLinhaAtual] = useState(-1);
  const [colunaAtual, setColunaAtual] = useState(-1);
  const [visitados, setVisitados] = useState(0);

  const [status, setStatus] = useState("Clique em uma casa para começar!");
  const [ajudaAtivada, setAjudaAtivada] = useState(false);

  /* ================= TABULEIRO ================= */

  function criarTabuleiro(n) {
    if (n < 3) return;

    const novo = [];
    for (let r = 0; r < n; r++) {
      const linha = [];
      for (let c = 0; c < n; c++) {
        linha.push({
          row: r,
          col: c,
          visitado: false,
          atual: false
        });
      }
      novo.push(linha);
    }

    setTabuleiro(novo);
    setTamanho(n);
    setLinhaAtual(-1);
    setColunaAtual(-1);
    setVisitados(0);
    setStatus("Clique em uma casa para começar!");
  }

  function reiniciar() {
    criarTabuleiro(tamanho);
  }

  /* ================= MOVIMENTOS ================= */

  function movimentoValido(row, col) {
    for (const [dr, dc] of MOVIMENTO_DO_CAVALO) {
      if (linhaAtual + dr === row && colunaAtual + dc === col) {
        return true;
      }
    }
    return false;
  }

  function clicarCasa(row, col) {
    if (linhaAtual === -1 || movimentoValido(row, col)) {
      moverCavalo(row, col);
    } else {
      setStatus("Movimento inválido!");
    }
  }

  function moverCavalo(row, col) {
    setTabuleiro(prev =>
      prev.map(linha =>
        linha.map(casa => {
          if (casa.atual) {
            return { ...casa, atual: false, visitado: true };
          }
          if (casa.row === row && casa.col === col) {
            return { ...casa, atual: true };
          }
          return casa;
        })
      )
    );

    setLinhaAtual(row);
    setColunaAtual(col);
    setVisitados(v => v + 1);
  }

  /* ================= STATUS ================= */

  useEffect(() => {
    if (tamanho === 0) return;

    if (visitados === tamanho * tamanho) {
      setStatus("🎉 Parabéns! Você completou o tabuleiro!");
      return;
    }

    let movimentos = 0;
    for (const [dr, dc] of MOVIMENTO_DO_CAVALO) {
      const r = linhaAtual + dr;
      const c = colunaAtual + dc;
      if (r >= 0 && r < tamanho && c >= 0 && c < tamanho) {
        if (!tabuleiro[r]?.[c]?.visitado) movimentos++;
      }
    }

    if (linhaAtual !== -1 && movimentos === 0) {
      setStatus(`❌ Fim de jogo! Você visitou ${visitados} casas.`);
    } else if (linhaAtual !== -1) {
      setStatus(`Movimentos restantes: ${tamanho * tamanho - visitados}`);
    }
  }, [visitados, tamanho, linhaAtual, tabuleiro]);

  /* ================= RENDER ================= */

  return (
    <>
      {/* BACKGROUND */}
      <Background />

      {/* INTRO */}
      {mostrarIntro && (
        <div id="intro">
          <h1>O Problema do Cavalo</h1>
          <p>Visite todas as casas do tabuleiro sem repetir nenhuma!</p>

          <button onClick={() => setMostrarInputInicio(v => !v)}>
            Iniciar
          </button>

          {mostrarInputInicio && (
            <div id="campoNumeroInicio">
              <label>Insira o tamanho do tabuleiro NxN:</label>
              <input
                type="number"
                onChange={e => setTamanho(Number(e.target.value))}
              />
              <button
                onClick={() => {
                  criarTabuleiro(tamanho);
                  setMostrarIntro(false);
                }}
              >
                Enviar
              </button>
            </div>
          )}

          <p>Utilizando apenas o movimento do cavalo no xadrez</p>
        </div>
      )}

      {/* JOGO */}
      {!mostrarIntro && (
        <div id="game-container">
          <header>
            <h1>O Problema do Cavalo</h1>
            <div id="status-message">{status}</div>
          </header>

          <div
            id="tabuleiro"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${tamanho}, 50px)`
            }}
          >
            {tabuleiro.map((linha, r) =>
              linha.map((casa, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`cell 
                    ${(r + c) % 2 === 0 ? "white" : "black"} 
                    ${casa.visitado ? "visitado" : ""}
                    ${casa.atual ? "posicao-atual" : ""}
                  `}
                  onClick={() => clicarCasa(r, c)}
                >
                  {casa.atual ? "♘" : ""}
                </div>
              ))
            )}
          </div>

          <div id="controls">
            <button onClick={reiniciar}>Reiniciar</button>

            <button onClick={() => setMostrarInput(v => !v)}>
              Criar um tabuleiro
            </button>

            {mostrarInput && (
              <div id="campoNumero">
                <input
                  type="number"
                  onChange={e => setTamanho(Number(e.target.value))}
                />
                <button onClick={() => criarTabuleiro(tamanho)}>
                  Enviar
                </button>
              </div>
            )}

            <div id="ajuda">
              <p>Deseja ajuda para visualizar os próximos movimentos?</p>
            </div>

            <input
              type="checkbox"
              checked={ajudaAtivada}
              onChange={() => setAjudaAtivada(v => !v)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;