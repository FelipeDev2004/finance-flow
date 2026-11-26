import { useEffect, useState } from 'react';
import './App.css';
import{
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita")
  const [categoria, setCategoria] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todas")
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [editandoId, setEditandoId] = useState(null);
  const [transacoes, setTransacoes] = useState(() => {
    const dados = localStorage.getItem("financeFlow-transacoes");
    return dados ? JSON.parse(dados) : [];
  });
  useEffect(() => {
    localStorage.setItem(
      "financeFlow-transacoes",
      JSON.stringify(transacoes)
    );
  }, [transacoes]);
  const receita = transacoes
    .filter(t => t.tipo === "receita")
    .reduce((total, t) => total + t.valor, 0);

  const Despesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((total, t) => total + t.valor, 0);

  const saldo = receita - Despesas;
  const dadosGrafico = [
  { nome: "Receitas", valor: receita, fill: "#22c55e" },
  { nome: "Despesas", valor: Despesas, fill: "#ef4444" }
];
  const transacoesFiltradas = transacoes.filter(t => {
    const tipoCorreto =
      filtroTipo === "todas" || t.tipo === filtroTipo;

    const categoriaCorreta =
      filtroCategoria === "todas" || t.categoria === filtroCategoria;
    return tipoCorreto && categoriaCorreta;

  });
  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  }
  function cancelarTransacao() {
    setDescricao("");
    setValor("");
    setTipo("receita");
    setCategoria("");
    setEditandoId(null);
    setMostrarFormulario(false);
  }
  function abrirNovaTransacao() {
    setDescricao("");
    setValor("");
    setCategoria("");
    setTipo("receita");
    setEditandoId(null);
    setMostrarFormulario(true);
  }
  function editarTransacao(transacao) {
    setDescricao(transacao.descricao);
    setValor(String(transacao.valor));
    setTipo(transacao.tipo);
    setCategoria(transacao.categoria || "");
    setEditandoId(transacao.id);
    setMostrarFormulario(true);
  }

  function excluirTransacao(id) {
    setTransacoes(listaAnterior =>
      listaAnterior.filter(t => t.id !== id)

    );
  }
  function salvarTransacao() {
    const valorNumerico = Number(valor);
    if (!categoria) {
      alert("Selecione uma categoria");
      return;
    }
    if (!descricao.trim() || !Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      alert("preencha a descrição e informe um valor maior que zero!")
      return;

    }
    const novaTransacao = {
      id: Date.now(),
      descricao: descricao,
      valor: valorNumerico,
      tipo: tipo,
      categoria: categoria
    };
    if (editandoId !== null) {
      setTransacoes(listaAnterior =>
        listaAnterior.map(t =>
          t.id === editandoId
            ? { ...novaTransacao, id: t.id }
            : t
        )
      );
    } else {
      setTransacoes(listaAnterior =>
        [...listaAnterior, novaTransacao]
      );
    }

    setEditandoId(null);

    setDescricao("");
    setValor("");
    setCategoria("")
    setMostrarFormulario(false);
  }
  return (
    <div className='container'>
      <h1>FinanceFlow</h1>
      <p>Seu controle financeiro inteligente</p>
      <button onClick={abrirNovaTransacao}> Nova Transação </button>
      {mostrarFormulario && (
        <div className='formulario'>
          <h2>  {editandoId !== null ? "Editar Transação" : "Nova Transação"}
          </h2>

          <input
            type='text'
            placeholder='Descrição da transação'
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <input
            type='number'
            placeholder='Valor da transação'
            onChange={(e) => setValor(e.target.value)}
            value={valor}
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Selecione uma categoria</option>
            <option value="Salário">Salário</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Moradia">Moradia</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
            <option value="Educação">Educação</option>
            <option value="Outros">Outros</option>
          </select>
          <button onClick={salvarTransacao}>
            {editandoId !== null ? "Salvar Alterações" : "Salvar Transação"} </button>
          <button onClick={cancelarTransacao}>Cancelar</button>
        </div>
      )}
      <h2>Resumo Financeiro</h2>
      <div className='cards'>
        <div className='card'>
          <h3>Saldo Total</h3>
          <p>{formatarMoeda(saldo)}</p>
        </div>
        <div className='card'>
          <h3>Receitas</h3>
          <p>{formatarMoeda(receita)}</p>
        </div>
        <div className='card'>
          <h3>Despesas</h3>
          <p>{formatarMoeda(Despesas)}</p>
        </div>
      </div>
      <div className="grafico">
  <h2>Receitas x Despesas</h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={dadosGrafico}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="nome" />
      <YAxis />
      <Tooltip formatter={(valor) => formatarMoeda(valor)} />
     <Bar dataKey="valor" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
      <div className='historico'>
        <h2>Histórico de Transação</h2>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="todas">Todas as transações</option>
          <option value="receita">Somente receitas</option>
          <option value="despesa">Somente despesas</option>
        </select>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="todas">Todas as categorias</option>
          <option value="Salário">Salário</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Moradia">Moradia</option>
          <option value="Lazer">Lazer</option>
          <option value="Saúde">Saúde</option>
          <option value="Educação">Educação</option>
          <option value="Outros">Outros</option>
        </select>
        {transacoesFiltradas.length === 0 && (
          <p>Nemhuma transação encontrada</p>
        )}
        {transacoesFiltradas.map((transacao) => (
          <div key={transacao.id} className="transacao">
            <p>{transacao.descricao}</p>
            <p>{formatarMoeda(transacao.valor)}</p>
            <p>{transacao.tipo}</p>
            <p>Categoria: {transacao.categoria || "Sem Categoria"}</p>
            <button onClick={() => editarTransacao(transacao)}>Editar</button>
            <button onClick={() => excluirTransacao(transacao.id)}> Excluir </button>
          </div>

        ))}
      </div>

    </div>
  );
}
export default App;