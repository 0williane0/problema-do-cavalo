// Estado do Jogo
let casa = [];
let linha_atual = -1;
let coluna_atual = -1;
let conta_visitados = 0;
let tamanho_tabuleiro_atual = 5;

const MOVIMENTO_DO_CAVALO = [
    [-2, -1], [-2, 1],
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],
    [2, -1], [2, 1]
];

function initGame() {
    const telaInicial = document.getElementById('intro');
    const startBtn = document.getElementById('iniciar-btn');
    const game = document.getElementById('game-container');
    const tabuleiro = document.getElementById('tabuleiro');
    const statusMessage = document.getElementById('status-message');

    const nInputInicio = document.getElementById('numeroInputInicio');
    const criarTabuleiroBtn = document.getElementById('criarTabuleiroBtn');
    const containerInput = document.getElementById('campoNumero');
    const numeroInput = document.getElementById('numeroInput');
    const pegarValor = document.getElementById('pegarValorBtn');
    const reiniciarBtn = document.getElementById('restart-btn');
    const voltarInicioBtn = document.getElementById('voltarInicioBtn');
    const ajudaAtivada = document.getElementById('toggle-switch');

    // Iniciar Jogo
    function iniciarJogo() {
        let valor = 5;
        if (nInputInicio && nInputInicio.value) {
            const parsed = parseInt(nInputInicio.value, 10);
            if (!isNaN(parsed) && parsed >= 5) {
                valor = parsed;
            }
        }
        cria_tabuleiro(valor);
        mostrar_jogo();
    }

    if (startBtn) {
        startBtn.addEventListener('click', iniciarJogo);
    }

    // Alternar telas
    function mostrar_jogo() {
        if (telaInicial) telaInicial.classList.add('hidden');
        if (game) game.classList.remove('hidden');
        ajustaTamanhoTabuleiro();
    }

    function voltarAoInicio() {
        if (game) game.classList.add('hidden');
        if (telaInicial) telaInicial.classList.remove('hidden');
    }

    if (voltarInicioBtn) {
        voltarInicioBtn.addEventListener('click', voltarAoInicio);
    }

    // Controles no Jogo
    function toggleCampoNumero() {
        if (!containerInput) return;
        if (containerInput.style.display === 'none' || containerInput.style.display === '') {
            containerInput.style.display = 'flex';
            if (numeroInput) {
                numeroInput.value = tamanho_tabuleiro_atual;
                numeroInput.focus();
            }
        } else {
            containerInput.style.display = 'none';
        }
    }

    if (criarTabuleiroBtn) {
        criarTabuleiroBtn.addEventListener('click', toggleCampoNumero);
    }

    if (pegarValor) {
        pegarValor.addEventListener('click', () => {
            if (!numeroInput) return;
            const valor = parseInt(numeroInput.value, 10);
            if (!isNaN(valor) && valor >= 5 && valor <= 12) {
                cria_tabuleiro(valor);
                if (containerInput) containerInput.style.display = 'none';
            } else {
                alert('Por favor, insira um tamanho válido entre 5 e 12.');
            }
        });
    }

    if (reiniciarBtn) {
        reiniciarBtn.addEventListener('click', () => {
            reiniciar();
        });
    }

    function reiniciar() {
        cria_tabuleiro(tamanho_tabuleiro_atual);
    }

    // Ajuste responsivo de tamanho do tabuleiro e células
    function ajustaTamanhoTabuleiro() {
        if (!tabuleiro || tamanho_tabuleiro_atual <= 0) return;

        const n = tamanho_tabuleiro_atual;
        const isMobile = window.innerWidth <= 600;

        // Espaço horizontal livre (descontando paddings da tela e bordas)
        const paddingTotal = isMobile ? 26 : 60;
        const maxAvailableWidth = Math.max(window.innerWidth - paddingTotal, 160);

        // Espaço vertical livre (deixando área visível para título e botões de controle)
        const maxAvailableHeight = Math.max(window.innerHeight * 0.55, 160);

        // O tabuleiro deve caber tanto na largura quanto na altura
        const maxBoardDimension = Math.min(maxAvailableWidth, maxAvailableHeight, 500);

        let cellSize = Math.floor(maxBoardDimension / n);
        // Limita o tamanho máximo em desktops para não ficar desproporcional
        if (cellSize > 56) cellSize = 56;
        if (cellSize < 16) cellSize = 16;

        const boardPx = cellSize * n;

        tabuleiro.style.setProperty('--cell-size', `${cellSize}px`);
        tabuleiro.style.setProperty('--grid-n', n);
        tabuleiro.style.gridTemplateColumns = `repeat(${n}, ${cellSize}px)`;
        tabuleiro.style.gridTemplateRows = `repeat(${n}, ${cellSize}px)`;
        tabuleiro.style.width = `${boardPx}px`;
        tabuleiro.style.height = `${boardPx}px`;
    }

    // Criação do Tabuleiro
    function cria_tabuleiro(n) {
        if (!tabuleiro) return;
        n = parseInt(n, 10);
        if (isNaN(n) || n < 5) n = 5;
        if (n > 12) n = 12;

        tamanho_tabuleiro_atual = n;
        ajustaTamanhoTabuleiro();

        casa = [];
        linha_atual = -1;
        coluna_atual = -1;
        conta_visitados = 0;
        if (statusMessage) statusMessage.textContent = 'Clique em uma casa para começar!';

        tabuleiro.innerHTML = '';
        tabuleiro.style.display = 'grid';

        for (let row = 0; row < n; row++) {
            casa[row] = [];
            for (let col = 0; col < n; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', (row + col) % 2 === 0 ? 'white' : 'black');
                cell.dataset.row = row;
                cell.dataset.col = col;
                tabuleiro.appendChild(cell);
                casa[row][col] = cell;

                cell.addEventListener('click', clicaCasa);
            }
        }
    }

    // Redimensiona quando a janela/tela muda de tamanho ou orientação
    window.addEventListener('resize', ajustaTamanhoTabuleiro);

    // Interação com Casas
    function clicaCasa(event) {
        const row = parseInt(event.currentTarget.dataset.row, 10);
        const col = parseInt(event.currentTarget.dataset.col, 10);

        if (linha_atual === -1) {
            moveCavalo(row, col);
        } else {
            if (movimentoValido(row, col)) {
                moveCavalo(row, col);
            } else {
                if (statusMessage) statusMessage.textContent = 'Movimento inválido! Tente outro.';
                setTimeout(() => mudaStatus(tamanho_tabuleiro_atual), 1000);
            }
        }
    }

    function moveCavalo(newRow, newCol) {
        if (linha_atual !== -1) {
            casa[linha_atual][coluna_atual].classList.remove('posicao-atual');
            casa[linha_atual][coluna_atual].classList.add('visitado');
            casa[linha_atual][coluna_atual].textContent = conta_visitados;
        }

        linha_atual = newRow;
        coluna_atual = newCol;
        conta_visitados++;

        casa[linha_atual][coluna_atual].classList.add('posicao-atual');
        casa[linha_atual][coluna_atual].textContent = '♘'; 
        
        atualizaMovimentosPossiveis(tamanho_tabuleiro_atual);
        mudaStatus(tamanho_tabuleiro_atual);
    }

    function movimentoValido(row, col) {
        if (casa[row][col].classList.contains('visitado') || (row === linha_atual && col === coluna_atual)) {
            return false;
        }
        
        for (const [dr, dc] of MOVIMENTO_DO_CAVALO) {
            if (linha_atual + dr === row && coluna_atual + dc === col) {
                return true;
            }
        }
        return false;
    }

    function atualizaMovimentosPossiveis(n) {
        document.querySelectorAll('.movimentos-possiveis').forEach(cell => {
            cell.classList.remove('movimentos-possiveis');
        });

        if (conta_visitados === n * n || linha_atual === -1) {
            return;
        }
        
        for (const [dr, dc] of MOVIMENTO_DO_CAVALO) {
            const newRow = linha_atual + dr;
            const newCol = coluna_atual + dc;
            
            if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
                if (!casa[newRow][newCol].classList.contains('visitado')) {
                    if (ajudaAtivada && ajudaAtivada.checked) {
                        casa[newRow][newCol].classList.add('movimentos-possiveis');
                    }
                }
            }
        }
    }

    if (ajudaAtivada) {
        ajudaAtivada.addEventListener('change', () => {
            if (linha_atual !== -1) {
                atualizaMovimentosPossiveis(tamanho_tabuleiro_atual);
            }
        });
    }

    function mudaStatus(n) {
        if (!statusMessage) return;

        if (conta_visitados === n * n) {
            statusMessage.textContent = '🎉 Parabéns! Você completou todo o tabuleiro!';
            document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', clicaCasa));
            return;
        }

        if (linha_atual === -1) {
            statusMessage.textContent = 'Clique em uma casa para começar!';
            return;
        }

        let movimentosPossiveis = 0;
        for (const [dr, dc] of MOVIMENTO_DO_CAVALO) {
            const newRow = linha_atual + dr;
            const newCol = coluna_atual + dc;
            if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
                if (!casa[newRow][newCol].classList.contains('visitado')) {
                    movimentosPossiveis++;
                }
            }
        }

        if (movimentosPossiveis === 0) {
            statusMessage.textContent = `Fim de jogo! Você visitou ${conta_visitados} de ${n * n} casas. Tente novamente!`;
            document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', clicaCasa));
        } else {
            statusMessage.textContent = `Casas visitadas: ${conta_visitados} / ${n * n} | Restantes: ${n * n - conta_visitados}`;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
