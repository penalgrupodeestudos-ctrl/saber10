// 🚀 PROJETO SABER - JAVASCRIPT PRINCIPAL

let QUESTOES = [];
const STORAGE_KEY = 'projetoSaberQuestoes';

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    carregarQuestoes();
    atualizarEstatisticas();
    document.getElementById('filtroQuestoes').addEventListener('input', filtrarQuestoes);
});

// CARREGAR QUESTÕES DO JSON
async function carregarQuestoes() {
    try {
        const response = await fetch('./data/todas-questoes.json');
        QUESTOES = await response.json();
        
        // Salva no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(QUESTOES));
        
        console.log('✅ ' + QUESTOES.length + ' questões carregadas!');
        atualizarEstatisticas();
    } catch (error) {
        console.error('❌ Erro ao carregar JSON:', error);
        carregarDoStorage();
    }
}

// CARREGAR DO LOCALSTORAGE SE JSON NÃO EXISTIR
function carregarDoStorage() {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (dados) {
        QUESTOES = JSON.parse(dados);
        console.log('✅ ' + QUESTOES.length + ' questões carregadas do cache!');
    } else {
        console.warn('⚠️ Nenhuma questão disponível');
    }
}

// OBTER QUESTÕES
function getQuestoes() {
    if (QUESTOES.length === 0) {
        carregarDoStorage();
    }
    return QUESTOES;
}

// MOSTRAR SEÇÃO
function mostrarSecao(secao) {
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    document.getElementById(secao).classList.add('active');
    event.target.classList.add('active');

    if (secao === 'simulados') carregarSimulados();
    else if (secao === 'questoes') carregarQuestoes();
    else if (secao === 'modo-professor') carregarModoProfessor();
    else if (secao === 'modo-deus') carregarModoDeus();
}

// ==================== SIMULADOS ====================

function carregarSimulados() {
    const html = `
        <div class="simulado-card" onclick="iniciarSimulado(0, 36, 'IASES')">
            <div class="simulado-titulo">📋 SIMULADO IASES</div>
            <div class="simulado-info">36 questões • Direitos Humanos, Constituição</div>
        </div>
        <div class="simulado-card" onclick="iniciarSimulado(36, 30, 'DIREITOS HUMANOS')">
            <div class="simulado-titulo">📚 SIMULADO DIREITOS HUMANOS</div>
            <div class="simulado-info">30 questões • Declaração Universal</div>
        </div>
        <div class="simulado-card" onclick="iniciarSimulado(66, 60, 'POLÍCIA PENAL 01')">
            <div class="simulado-titulo">⚖️ SIMULADO POLÍCIA PENAL 01</div>
            <div class="simulado-info">60 questões • Português, Lógica, Direito</div>
        </div>
        <div class="simulado-card" onclick="iniciarSimulado(126, 60, 'POLÍCIA PENAL 02')">
            <div class="simulado-titulo">⚖️ SIMULADO POLÍCIA PENAL 02</div>
            <div class="simulado-info">60 questões • Completo com todas as áreas</div>
        </div>
    `;
    document.getElementById('listaSimulados').innerHTML = html;
}

function iniciarSimulado(inicio, quantidade, nome) {
    const questoes = getQuestoes().slice(inicio, inicio + quantidade);
    let html = `<h2>${nome}</h2><p>Total: ${quantidade} questões</p>`;
    
    questoes.forEach((q, i) => {
        html += renderQuestao(q, i);
    });
    
    html += '<button class="btn btn-success" onclick="finalizarSimulado()">✅ Finalizar</button>';
    
    document.getElementById('listaSimulados').innerHTML = html;
}

// ==================== QUESTÕES ====================

function carregarQuestoes() {
    const questoes = getQuestoes();
    let html = `<p>Carregando ${questoes.length} questões...</p>`;
    
    questoes.forEach((q, i) => {
        html += renderQuestao(q, i);
    });
    
    document.getElementById('listaQuestoes').innerHTML = html;
}

function filtrarQuestoes() {
    const filtro = document.getElementById('filtroQuestoes').value.toLowerCase();
    const questoes = getQuestoes();
    
    const filtradas = questoes.filter(q =>
        (q.disciplina || '').toLowerCase().includes(filtro) ||
        (q.questao || '').toLowerCase().includes(filtro)
    );
    
    let html = `<p>${filtradas.length} de ${questoes.length} questões</p>`;
    filtradas.forEach((q, i) => {
        html += renderQuestao(q, i);
    });
    
    document.getElementById('listaQuestoes').innerHTML = html;
}

// ==================== RENDERIZAR QUESTÃO ====================

function renderQuestao(q, indice) {
    let html = `
        <div class="questao-card" id="q${indice}">
            <div class="questao-header">
                <div class="questao-numero">Q${q.numero || indice + 1}</div>
                <div class="disciplina-badge">${q.disciplina || 'Geral'}</div>
            </div>
            <div class="questao-texto"><strong>${q.questao}</strong></div>
            <div class="opcoes" id="opcoes${indice}">
    `;
    
    Object.entries(q.opcoes || {}).forEach(([letra, texto]) => {
        html += `
            <div class="opcao" onclick="selecionarOpcao(${indice}, '${letra}', '${q.resposta_correta}')">
                <span class="opcao-letra">${letra}</span>
                ${texto}
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="explicacao-box" id="exp${indice}">
                <strong>✅ Resposta: ${q.resposta_correta}</strong><br><br>
                <strong>📝 Explicação:</strong> ${q.explicacao_professor || 'Sem explicação'}
            </div>
            <button class="btn btn-secondary" onclick="toggleExplicacao(${indice})">Ver Gabarito</button>
        </div>
    `;
    
    return html;
}

function selecionarOpcao(indice, letra, correta) {
    const opcoes = document.querySelectorAll(`#opcoes${indice} .opcao`);
    
    opcoes.forEach(op => {
        op.classList.remove('selecionada', 'correta', 'incorreta');
        
        if (op.textContent.trim().startsWith(letra)) {
            op.classList.add('selecionada');
            if (letra === correta) {
                op.classList.add('correta');
            } else {
                op.classList.add('incorreta');
            }
        }
        
        if (op.textContent.trim().startsWith(correta)) {
            op.classList.add('correta');
        }
    });
    
    document.getElementById(`exp${indice}`).classList.add('show');
}

function toggleExplicacao(indice) {
    document.getElementById(`exp${indice}`).classList.toggle('show');
}

// ==================== MODO PROFESSOR ====================

function carregarModoProfessor() {
    const questoes = getQuestoes();
    let html = '<p style="color: #28a745; font-weight: bold;">📚 Modo com explicações detalhadas</p>';
    
    questoes.forEach((q, i) => {
        let card = renderQuestao(q, i);
        // Mostra explicação automaticamente
        card = card.replace(`id="exp${i}"`, `id="exp${i}" class="show"`);
        html += card;
    });
    
    document.getElementById('conteudoProfessor').innerHTML = html;
}

// ==================== MODO DEUS ====================

function carregarModoDeus() {
    const questoes = getQuestoes();
    let html = '<p style="color: #ffc107; font-weight: bold;">⚡ Todas as respostas visíveis!</p>';
    
    questoes.forEach((q, i) => {
        html += `
            <div class="questao-card">
                <div class="questao-header">
                    <div class="questao-numero">Q${q.numero}</div>
                    <div class="disciplina-badge">${q.disciplina}</div>
                </div>
                <div class="questao-texto"><strong>${q.questao}</strong></div>
                <div class="opcoes">
        `;
        
        Object.entries(q.opcoes || {}).forEach(([letra, texto]) => {
            const isCorreta = letra === q.resposta_correta;
            const classe = isCorreta ? 'correta' : '';
            html += `
                <div class="opcao ${classe}">
                    <span class="opcao-letra">${letra}</span>
                    ${texto} ${isCorreta ? '✅' : ''}
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="explicacao-box show">
                    <strong>✅ GABARITO: ${q.resposta_correta}</strong><br><br>
                    ${q.explicacao_professor || 'Sem explicação'}
                </div>
            </div>
        `;
    });
    
    document.getElementById('conteudoDeus').innerHTML = html;
}

// ==================== FUNÇÕES DO ADMIN ====================

function atualizarEstatisticas() {
    const questoes = getQuestoes();
    const disciplinas = new Set(questoes.map(q => q.disciplina || 'Geral'));
    
    document.getElementById('totalQuestoes').textContent = questoes.length;
    document.getElementById('totalDisciplinas').textContent = disciplinas.size;
}

function exportarJSON() {
    const questoes = getQuestoes();
    const json = JSON.stringify(questoes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Saber-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ JSON exportado!');
}

function exportarCSV() {
    const questoes = getQuestoes();
    let csv = 'Número,Disciplina,Questão,Resposta,Explicação\n';
    
    questoes.forEach(q => {
        csv += `"${q.numero}","${q.disciplina}","${q.questao.replace(/"/g, '""')}","${q.resposta_correta}","${(q.explicacao_professor || '').replace(/"/g, '""')}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Saber-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ CSV exportado!');
}

function importarJSON() {
    try {
        const novo = JSON.parse(document.getElementById('jsonImportar').value);
        if (Array.isArray(novo) && novo.length > 0) {
            QUESTOES = novo;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
            alert(`✅ ${novo.length} questões importadas!`);
            atualizarEstatisticas();
            document.getElementById('jsonImportar').value = '';
            location.reload();
        } else {
            alert('❌ JSON deve ser um array válido!');
        }
    } catch(e) {
        alert('❌ Erro: ' + e.message);
    }
}

function limparDados() {
    if (confirm('⚠️ TEM CERTEZA? Isto apagará TUDO!')) {
        localStorage.removeItem(STORAGE_KEY);
        QUESTOES = [];
        alert('✅ Dados limpos!');
        location.reload();
    }
}

function restaurarDados() {
    if (confirm('🔄 Restaurar aos dados padrão?')) {
        location.reload();
    }
}

function finalizarSimulado() {
    alert('✅ Simulado finalizado!');
    mostrarSecao('home');
}