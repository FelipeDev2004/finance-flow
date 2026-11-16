import { useState } from 'react';
import './App.css';


function App() {
  const [saldo, setSaldo] = useState(0);
  const [receita, setreceitas] = useState(0);
  const [Despesas, setDespesas] = useState(0);
  return (
    <div className='container'>
      <h1>FinanceFlow</h1>
      <p>Seu controle financeiro inteligente</p>

      <button onClick={() => {
  setreceitas(valorAnterior => valorAnterior + 500);
  setSaldo(valorAnterior => valorAnterior + 500);
}}>
  Adicionar Receita
</button>

      <h2>Resumo Financeiro</h2>
      <button onClick={() => setSaldo(valorAnterior => valorAnterior - 200)}>Adicionar Despesas
      </button>
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
    </div>
  );
}
export default App;