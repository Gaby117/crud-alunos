import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Edit3, 
  Trash2, 
  GraduationCap, 
  Save, 
  X, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Loader2,
  Info,
  Code2
} from 'lucide-react';

// Modelo de Dados do Aluno (conforme Seção 3 do PDF)
export interface Aluno {
  id: number;
  nome: string;
  curso: string;
}

// Dados iniciais para demonstração (conforme Seção 6 do PDF)
const DADOS_INICIAIS: Aluno[] = [
  { id: 1, nome: 'Anna Gabryelle', curso: 'Redes' },
  { id: 2, nome: 'Yasmin', curso: 'Informática' },
  { id: 3, nome: 'Beatriz', curso: 'Edificações' },
];

export default function App() {
  // --- Estados do CRUD (conforme Seção 2 do PDF) ---
  const [nome, setNome] = useState<string>('');
  const [curso, setCurso] = useState<string>('');
  const [alunos, setAlunos] = useState<Aluno[]>(DADOS_INICIAIS);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState<Aluno | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  
  // Feedback / Mensagens de Alerta (conforme Seção 10 do PDF)
  const [mensagemAlerta, setMensagemAlerta] = useState<{ tipo: 'sucesso' | 'erro' | 'aviso'; texto: string } | null>(null);

  // Modo de Operação: Local (Fase 1) ou Simulação com API HTTP (Fase 2)
  const [modoApi, setModoApi] = useState<boolean>(false);
  const [logsHttp, setLogsHttp] = useState<{ metodo: string; url: string; status: string; horario: string }[]>([]);

  // Modal do Guia de Estudos
  const [mostrarGuia, setMostrarGuia] = useState<boolean>(false);

  // Helper para exibir alertas temporários
  const mostrarMensagem = (tipo: 'sucesso' | 'erro' | 'aviso', texto: string) => {
    setMensagemAlerta({ tipo, texto });
    setTimeout(() => {
      setMensagemAlerta((atual) => (atual?.texto === texto ? null : atual));
    }, 3500);
  };

  // Helper para adicionar log HTTP (Fase 2)
  const adicionarLogHttp = (metodo: string, url: string, status: string) => {
    const agora = new Date().toLocaleTimeString('pt-BR');
    setLogsHttp((anteriores) => [
      { metodo, url, status, horario: agora },
      ...anteriores.slice(0, 5),
    ]);
  };

  // --- CREATE: Cadastrar Aluno (conforme Seção 7 do PDF) ---
  const handleCadastrar = async () => {
    // Validação de campos vazios (Seção 10 do PDF)
    if (!nome.trim() || !curso.trim()) {
      mostrarMensagem('aviso', 'Por favor, preencha o nome e o curso do aluno!');
      return;
    }

    setCarregando(true);
    try {
      if (modoApi) {
        // Simulação HTTP POST (Fase 2)
        await new Promise((resolve) => setTimeout(resolve, 450));
        adicionarLogHttp('POST', '/api/alunos', '201 Created');
      }

      const novoId = alunos.length > 0 ? Math.max(...alunos.map((a) => a.id)) + 1 : 1;
      const novoAluno: Aluno = {
        id: novoId,
        nome: nome.trim(),
        curso: curso.trim(),
      };

      setAlunos((anteriores) => [...anteriores, novoAluno]);
      setNome('');
      setCurso('');
      mostrarMensagem('sucesso', `Aluno "${novoAluno.nome}" cadastrado com sucesso!`);
    } catch {
      mostrarMensagem('erro', 'Falha ao cadastrar o aluno.');
    } finally {
      setCarregando(false);
    }
  };

  // --- UPDATE: Iniciar Edição (conforme Seção 9 do PDF) ---
  const handleIniciarEdicao = (aluno: Aluno) => {
    setAlunoEmEdicao(aluno);
    setNome(aluno.nome);
    setCurso(aluno.curso);
    mostrarMensagem('aviso', `Editando dados do aluno #${aluno.id}`);
  };

  // --- UPDATE: Salvar Alteração (conforme Seção 9 do PDF) ---
  const handleSalvarEdicao = async () => {
    if (!alunoEmEdicao) return;

    if (!nome.trim() || !curso.trim()) {
      mostrarMensagem('aviso', 'Nome e curso não podem ficar vazios!');
      return;
    }

    setCarregando(true);
    try {
      if (modoApi) {
        // Simulação HTTP PUT (Fase 2)
        await new Promise((resolve) => setTimeout(resolve, 450));
        adicionarLogHttp('PUT', `/api/alunos/${alunoEmEdicao.id}`, '200 OK');
      }

      setAlunos((anteriores) =>
        anteriores.map((item) =>
          item.id === alunoEmEdicao.id
            ? { ...item, nome: nome.trim(), curso: curso.trim() }
            : item
        )
      );

      mostrarMensagem('sucesso', `Dados do aluno #${alunoEmEdicao.id} atualizados!`);
      setNome('');
      setCurso('');
      setAlunoEmEdicao(null);
    } catch {
      mostrarMensagem('erro', 'Erro ao atualizar dados do aluno.');
    } finally {
      setCarregando(false);
    }
  };

  // Cancelar edição
  const handleCancelarEdicao = () => {
    setAlunoEmEdicao(null);
    setNome('');
    setCurso('');
  };

  // --- DELETE: Excluir Aluno (conforme Seção 8 do PDF) ---
  const handleExcluir = async (id: number) => {
    const aluno = alunos.find((a) => a.id === id);
    const nomeExcluido = aluno ? aluno.nome : `ID #${id}`;

    if (!window.confirm(`Deseja realmente excluir o aluno "${nomeExcluido}"?`)) return;

    setCarregando(true);
    try {
      if (modoApi) {
        // Simulação HTTP DELETE (Fase 2)
        await new Promise((resolve) => setTimeout(resolve, 400));
        adicionarLogHttp('DELETE', `/api/alunos/${id}`, '200 OK');
      }

      setAlunos((anteriores) => anteriores.filter((item) => item.id !== id));

      if (alunoEmEdicao?.id === id) {
        handleCancelarEdicao();
      }

      mostrarMensagem('sucesso', `Aluno "${nomeExcluido}" excluído.`);
    } catch {
      mostrarMensagem('erro', 'Erro ao excluir aluno.');
    } finally {
      setCarregando(false);
    }
  };

  // Restaurar dados padrão
  const handleRestaurarPadrao = () => {
    setAlunos(DADOS_INICIAIS);
    handleCancelarEdicao();
    mostrarMensagem('sucesso', 'Lista restaurada para os alunos de teste.');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1e0c21] via-[#2a112f] to-[#341539] text-slate-100 flex flex-col justify-center items-center p-3 sm:p-6 font-sans">
      
      {/* Barra Superior Simples com Ações Rápidas */}
      <div className="w-full max-w-[440px] flex items-center justify-between gap-2 mb-3 px-1 text-xs">
        <button
          onClick={() => {
            setModoApi(!modoApi);
            mostrarMensagem('aviso', !modoApi ? 'Modo API HTTP (Fase 2) ativado' : 'Modo Local useState (Fase 1) ativado');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
            modoApi
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
              : 'bg-white/10 text-slate-200 border border-white/10 hover:bg-white/15'
          }`}
          title="Alternar entre CRUD Local e Requisições HTTP"
        >
          <Server className="w-3.5 h-3.5" />
          <span>{modoApi ? 'Modo API HTTP' : 'Modo Local'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestaurarPadrao}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            title="Restaurar dados de teste"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setMostrarGuia(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#341539] hover:bg-[#451c4c] text-white font-medium border border-white/15 shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guia</span>
          </button>
        </div>
      </div>

      {/* Cartão Principal do App (Layout simples do PDF) */}
      <div className="w-full max-w-[440px] bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">
        
        {/* Cabeçalho do App com a cor #341539 (conforme Seção 5 do PDF) */}
        <div className="px-6 py-5 bg-[#341539] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-xs">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">
                Cadastro de Alunos
              </h1>
              <p className="text-xs text-purple-200 font-medium">
                {modoApi ? 'Fase 2 • Comunicação com API' : 'Fase 1 • CRUD Local'}
              </p>
            </div>
          </div>

          {/* ActivityIndicator / Carregando (conforme Seção 2 do PDF) */}
          {carregando && (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-[11px]">Processando</span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-4">
          
          {/* Alerta de Validação / Mensagens (Seção 10 do PDF) */}
          {mensagemAlerta && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all shadow-xs ${
                mensagemAlerta.tipo === 'sucesso'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : mensagemAlerta.tipo === 'erro'
                  ? 'bg-rose-50 text-rose-900 border border-rose-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              {mensagemAlerta.tipo === 'sucesso' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
              {mensagemAlerta.tipo === 'erro' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
              {mensagemAlerta.tipo === 'aviso' && <Info className="w-4 h-4 shrink-0 text-amber-600" />}
              <span className="flex-1">{mensagemAlerta.texto}</span>
              <button
                onClick={() => setMensagemAlerta(null)}
                className="opacity-60 hover:opacity-100 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* FORMULÁRIO DE ENTRADA (Seção 5: Nome, Curso, Botão Cadastrar/Salvar) */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4.5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {alunoEmEdicao ? `Editando Aluno #${alunoEmEdicao.id}` : 'Novo Cadastro'}
              </span>
              {alunoEmEdicao && (
                <button
                  onClick={handleCancelarEdicao}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <X className="w-3 h-3" /> Cancelar
                </button>
              )}
            </div>

            {/* Campo de texto para o nome */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Aluno
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#341539]/25 focus:border-[#341539] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') alunoEmEdicao ? handleSalvarEdicao() : handleCadastrar();
                }}
              />
            </div>

            {/* Campo de texto para o curso */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Curso
              </label>
              <input
                type="text"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                placeholder="Ex: Informática, Administração..."
                className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#341539]/25 focus:border-[#341539] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') alunoEmEdicao ? handleSalvarEdicao() : handleCadastrar();
                }}
              />
            </div>

            {/* Botão para cadastrar/salvar */}
            <div className="pt-1">
              {alunoEmEdicao ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSalvarEdicao}
                    disabled={carregando}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                  <button
                    onClick={handleCancelarEdicao}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 px-3.5 rounded-xl text-sm transition-colors cursor-pointer"
                    title="Descartar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCadastrar}
                  disabled={carregando}
                  className="w-full bg-[#341539] hover:bg-[#461e4c] active:bg-[#260f2a] text-white font-semibold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar Aluno</span>
                </button>
              )}
            </div>
          </div>

          {/* ÁREA DA LISTA (Seção 5 e 6: Exibir lista de alunos) */}
          <div className="flex flex-col gap-2.5 mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Lista de Alunos
                </h2>
                <span className="bg-[#341539]/10 text-[#341539] font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#341539]/20">
                  {alunos.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {alunos.length === 1 ? '1 aluno registrado' : `${alunos.length} alunos registrados`}
              </span>
            </div>

            {/* Itens da Lista */}
            <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-0.5">
              {alunos.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
                  <GraduationCap className="w-8 h-8 mx-auto text-slate-400 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">Nenhum aluno cadastrado.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Utilize os campos acima para adicionar o primeiro aluno.
                  </p>
                </div>
              ) : (
                alunos.map((aluno) => {
                  const estaEditando = alunoEmEdicao?.id === aluno.id;
                  return (
                    <div
                      key={aluno.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        estaEditando
                          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200/70 shadow-xs'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Dados: ID, Nome e Curso (Seção 3 do PDF) */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-[#341539]/10 text-[#341539] border border-[#341539]/20 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          #{aluno.id}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {aluno.nome}
                          </h3>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#341539] shrink-0" />
                            <span>{aluno.curso}</span>
                          </p>
                        </div>
                      </div>

                      {/* Botões Editar e Excluir (Seção 5 do PDF) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleIniciarEdicao(aluno)}
                          disabled={carregando}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                            estaEditando
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800'
                          }`}
                          title="Editar aluno"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Editar</span>
                        </button>

                        <button
                          onClick={() => handleExcluir(aluno.id)}
                          disabled={carregando}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1"
                          title="Excluir aluno"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Excluir</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Histórico HTTP para estudo da Fase 2 */}
          {modoApi && (
            <div className="mt-1 bg-slate-900 text-slate-200 p-3 rounded-2xl text-xs font-mono border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800 text-[11px]">
                <span className="flex items-center gap-1.5 font-sans font-bold text-slate-300">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  Requisições HTTP (Fase 2)
                </span>
                <span className="text-emerald-400 text-[10px]">API Ativa</span>
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto text-[11px]">
                {logsHttp.length === 0 ? (
                  <p className="text-slate-500 italic">Faça uma ação para ver o log HTTP...</p>
                ) : (
                  logsHttp.map((log, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-purple-300">{log.metodo}</span>
                        <span className="text-slate-300 truncate">{log.url}</span>
                      </span>
                      <span className="text-slate-400 text-[10px] shrink-0">
                        {log.status} • {log.horario}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: Guia do Trabalho e Respostas */}
      {mostrarGuia && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#341539] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-sm sm:text-base">
                  PDMO: Guia & Respostas do Trabalho
                </h3>
              </div>
              <button
                onClick={() => setMostrarGuia(false)}
                className="text-purple-200 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="bg-[#341539]/5 border border-[#341539]/20 rounded-2xl p-3.5">
                <h4 className="font-bold text-[#341539] mb-2">
                  Tabela CRUD vs HTTP (Seção 12 do PDF)
                </h4>
                <div className="space-y-1.5 font-sans">
                  <div className="flex justify-between py-1 border-b border-[#341539]/10">
                    <span className="font-bold text-emerald-700">CREATE</span>
                    <span className="font-mono font-bold text-emerald-800">POST /api/alunos</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#341539]/10">
                    <span className="font-bold text-blue-700">READ</span>
                    <span className="font-mono font-bold text-blue-800">GET /api/alunos</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#341539]/10">
                    <span className="font-bold text-amber-700">UPDATE</span>
                    <span className="font-mono font-bold text-amber-800">PUT /api/alunos/:id</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-rose-700">DELETE</span>
                    <span className="font-mono font-bold text-rose-800">DELETE /api/alunos/:id</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Desafio de Compreensão (Seção 15)
                </h4>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">Diferença Local vs API:</p>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    No app local, os dados ficam no estado <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">useState</code> (apenas na memória do aparelho). Na API, os dados são enviados e salvos permanentemente em um banco de dados via requisições HTTP.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">JSON e async/await:</p>
                  <ul className="mt-1 space-y-1 text-slate-600 list-disc pl-4 leading-relaxed">
                    <li><strong className="text-slate-800">JSON.stringify():</strong> converte objeto JS em texto para envio via HTTP.</li>
                    <li><strong className="text-slate-800">response.json():</strong> converte a resposta recebida de volta em objeto JS.</li>
                    <li><strong className="text-slate-800">async / await:</strong> aguarda a resposta assíncrona da API sem travar a interface.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setMostrarGuia(false)}
                className="bg-[#341539] hover:bg-[#461e4c] text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
