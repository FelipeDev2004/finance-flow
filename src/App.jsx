import { use, useState } from 'react';
import './App.css';


function App() {
  const [saldo, setSaldo] = useState(0);
  const [receita, setreceitas] = useState(0);
  const [Despesas, setDespesas] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita")
  const [transacoes,setTransacoes] = useState([]);
  function salvarTransacao() {
    const valorNumerico = Number(valor);
    if (!descricao.trim() || !Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      alert("preencha a descrição e informe um valor maior que zero!")
      return;

    }
    if (tipo === "receita") {
      setreceitas(valorAnterior => valorAnterior + valorNumerico);
      setSaldo(valorAnterior => valorAnterior + valorNumerico);
    } else {
      setDespesas(valorAnterior => valorAnterior + valorNumerico);
      setSaldo(valorAnterior => valorAnterior - valorNumerico);
    } 
    const novaTransacao ={
      id: Date.now(),
      descricao: descricao,
      valor: valorNumerico,
      tipo: tipo
    };
      setTransacoes(listaAnterior => [...listaAnterior, novaTransacao]);

    setDescricao("");
    setValor("");
    setMostrarFormulario(false);
  }
  return (
    <div className='container'>
      <h1>FinanceFlow</h1>
      <p>Seu controle financeiro inteligente</p>
      <button onClick={() => setMostrarFormulario(true)}> Nova Transação </button>
      {mostrarFormulario && (
        <div className='formulario'>
          <h2>Nova Transação</h2>

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
          <button onClick={salvarTransacao}> Salvar Transação</button>
        </div>
      )}
      <h2>Resumo Financeiro</h2>
      <div className='cards'>
        <div className='card'>
          <h3>Saldo Total</h3>
          <p>R$ {saldo}</p>
        </div>
        <div className='card'>
          <h3>Receitas</h3>
          <p>R$ {receita}</p>
        </div>
        <div className='card'>
          <h3>Despesas</h3>
          <p>R$ {Despesas}</p>
          </div>
          </div>
        <div className='historico'>
            <h2>Histórico de Transação</h2>
            {transacoes.map((transacao) => (
              <div key={transacao.id} className="transacao">  
              <p>{transacao.descricao}</p>
                <p>R${transacao.valor}</p>
                <p>{transacao.tipo}</p>
              </div>

            ))}
          </div>       

    </div>         
   );          
  }
export default App;