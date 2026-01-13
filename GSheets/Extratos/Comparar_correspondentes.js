// COMPARAR_CORRESPONDENTES



// ao passar por cada linha na tabela alvo
  // filtrar linhas desejadas, que estiver com coluna ROXA de status de analise de corresps vazio
  // tentar encontrar padrao da _DESC_CORRESP na DESCRICAO da tabela alvo
  // OU alterar as celulas da tabela alvo
  // OU alimentar res_valores
  // pintar linhas que foram analisadas 
  // SE estiver alterando a tabela alvo, pintar celulas que foram alteradas
  // despejar res_valores


// - valores_resultado: 
  // array bidimensional, que sera usado para gerar a tabela 
  // de resultado na seguinte forma:

      // const cols = ['Nome', 'Idade']
      // const res_valores = [
      //   ['Ana',  25],
      //   ['Beto', 30]
      // ];

      // const sheet_resultado = ss.insertSheet(`_p_res_${agora()}`);
      // sheet_resultado.getRange(1, 1, res_valores.length, cols.length).setValues(res_valores);

  // ou despejar cada linha ? 
