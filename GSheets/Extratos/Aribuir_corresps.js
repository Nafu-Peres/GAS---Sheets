// @ts-check


/** @type {Extratos.At_corresps.AT_CORRESPS} */
function AT_CORRESPS({
  sheet_alvo,
  sheet_corresp, 
  modificar_sheet_og,
}){

  const cols_compartilhadas = [
    'GRUPO',	'DESCRICAO',	'EVENTO', 'CONTRAPARTE', 'BANCO_CONTRAPARTE'
  ]

  const s_alvo_cols = [
    'DATA',	'DESCRICAO_EXTRATO', 'TITULAR',	'BANCO_TITULAR',	'VALOR', '_CORRESP_OBS_', '_CORRESP_DATA_', ...cols_compartilhadas		
  ]

  const s_corresp_cols = [
    '_DESC_EXT_CORRESP_', '_DATA_INI_', '_DATA_FIM_', '_VALOR_MIN_', '_VALOR_MAX_', '_TITULAR_', '_BANCO_TITULAR_', ...cols_compartilhadas
  ]


  /** @type {Gsheet.Sheet_obj.sheet_obj} */
  const s_alvo = Sheet_obj({
    sheet: sheet_alvo,
    cols_obrigatorias: s_alvo_cols,
  })

  /** @type {Gsheet.Sheet_obj.sheet_obj} */
  const s_corresp = Sheet_obj({
    sheet: sheet_corresp,
    cols_obrigatorias: s_corresp_cols
  })

  const sheet_saida = SpreadsheetApp
  .getActiveSpreadsheet()
  .insertSheet(`${get_data_hora()}-COMPARAR_P`)

  sheet_saida
  .getRange(1, 1, 1, s_alvo_cols.length)
  .setValues([s_alvo_cols])

  /** @type {Gsheet.Sheet_obj.sheet_obj} */
  const s_saida = Sheet_obj({
    sheet: sheet_saida,
    cols_obrigatorias: s_alvo_cols
  })  

  //
  for (const linha_alvo of s_alvo.linhas){

    /** @type {Gsheet.Sheet_obj.linha_obj} */
    const linha_saida = s_saida.append_linha({})
    

    /** @type {Gsheet.Sheet_obj.linha_obj | undefined} */
    const _linha_corresp = get__linha_correspondente({linha: linha_alvo})
    
    /// ALIMENTAR SAIDA
    // valores de cada celula(cel) da linha saida
    const l_saida_valores = s_saida.cols.map((ss_col) => {
      
      let cel_v_saida = ''

      if(_linha_corresp)
        try {cel_v_saida = _linha_corresp.get_cel(ss_col.nome).valor} catch{}
      
      if (cel_v_saida) return cel_v_saida
        cel_v_saida = linha_alvo.get_cel(ss_col.nome).valor // nap precisa de try catch; colunas de s_alvo === s_saida

      return cel_v_saida
    })

    linha_saida.range.setValues([l_saida_valores])  

    const corersp_obs = _linha_corresp 
    ? `CORRESP L n°= ${_linha_corresp?.range.getRow()}`
    : '!CORRESP'
    
    linha_alvo.get_cel('_CORRESP_OBS_').range.setValue(corersp_obs)
    linha_alvo.get_cel('_CORRESP_DATA_').range.setValue(get_data_hora())

    linha_saida.get_cel('_CORRESP_OBS_').range.setValue(corersp_obs)
    linha_saida.get_cel('_CORRESP_DATA_').range.setValue(get_data_hora())

  }  

  

  // checar correspndencia entre linhas:

  /** 
   * @param {{linha: Gsheet.Sheet_obj.linha_obj}} param
  */
  function get__linha_correspondente ({linha}){

    const desc_extrato = linha
    .get_cel('DESC_EXTRATO').valor

    const data = linha
    .get_cel('DATA').valor

    const valor = linha
    .get_cel('VALOR').valor

    const banco_titu = linha
    .get_cel('BANCO_TITU').valor

    //  
    for (const _linha of s_corresp.linhas){
    
      const todas_cel_condicao_vazias = s_corresp.cols
      .filter(col => col.nome[0] === '_')
      .every(col => !_linha.get_cel(col.nome).valor) 
  
      if(todas_cel_condicao_vazias){
        console.warn (`
          A planilha de correspondentes com celulas 
          de condições todas vazias:
          posicao da linha: ${_linha.range.getRow()}
          valores da linha: ${_linha.valores}
        `)
        
        _linha.range.setBackground('#ff8888')
        continue
      }
  
      const _descricao = _linha
      .get_cel( '_DESCRICAO_').valor
  
      const _data_ini = _linha
      .get_cel('_DATA_INI_').valor
  
      const _data_fim = _linha
      .get_cel('_DATA_FIM_').valor 
  
      const _valor_min = _linha
      .get_cel('_VALOR_MIN_').valor
  
      const _valor_max = _linha
      .get_cel('_VALOR_MAX_').valor
  
      const _banco_titu = _linha
      .get_cel('_BANCO_TITU_').valor
  
  
      const condicoes = [
        () => _data_ini ? data >= _data_ini : true,
        () => _data_fim ? data <= _data_fim : true,
        () => _valor_min ? valor >= _valor_min : true,
        () =>_valor_max ? valor <= _valor_max : true,
        () => _banco_titu ? _banco_titu === banco_titu : true,  
        () => _descricao ? descricoes_correspondem({
          desc_corresp: _descricao,  
          descricao: desc_extrato
        }) : true, 
      ]
  
      if (condicoes.every(cond => cond())) return _linha 
    }
  }
}




/// checar DESCRICAO com DESCRICAO_CORRESPONDENTE
//


  /** @param {{desc_corresp: string, descricao: string}} params */
function descricoes_correspondem({desc_corresp, descricao}){
  
  /**@type {RegExpStringIterator} */
  const matches_entre_parentes = desc_corresp.matchAll(/\(([^()]*)\)/g) || []//match para capturar "(conteudo entre parenteses)"

  for (const m of matches_entre_parentes){
    
    if(!m[1]) break

    const sub_desc_corresponde = descricoes_correspondem(m[1])// m[1] = "match_conteudo" sem parentes

    const str_bool = sub_desc_corresponde
    ? '_true_'
    : '_false_'

    desc_corresp.replace(m[0], str_bool)// m[0] = "(match_conteudo)" com parentes
    // substituit o resultado da comparacao de cada que estiver dentro de cada conjunto de parenteses
    // pelas strings "_true_" ou "_false_" assim, comparando essas strings com antecendencia para continuar o processo
  }

  const desc_correspondem =  desc_corresp.split('||').some(sub_desc_corresp => {
    const sub = sub_desc_corresp.trim()
    if (sub === '_true_') return true
    if (sub === '_false_') return false

    return sub_desc_corresp.split('&&').every(dc_and => {
      if (sub === '_true_') return true
      if (sub === '_false_') return false

      return dc_and.match(descricao)
    })
  })
  
  return desc_correspondem
}

