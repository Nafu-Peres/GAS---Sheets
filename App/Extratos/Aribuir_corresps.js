// @ts-check
//@ts-ignore
app.extratos = app.extratos || {}


/** @type {app.extratos.atribuir_corresps.atribuir_corresps} */
app.extratos.atribuir_corresps = ({ nome_aba_alvo, nome_aba_corresp, ssheet, }) => {

  const s_saida_cols = [
    'DATA', 'GRUPO', 'DESCRICAO', 'DESCRICAO_EXTRATO', 'EVENTO', 'TITULAR', 'BANCO_TITULAR', 'CC', 'VALOR', 'CONTRAPARTE', 'BANCO_CONTRAPARTE', 'CORRESP_DATA', 'CORRESP_ID', 'ALVO_ID'
  ]

  const s_alvo_cols = [
    'DATA',	'DESCRICAO_EXTRATO', 'TITULAR',	'BANCO_TITULAR', 'CC',	'VALOR', 'CORRESP_ID', 'CORRESP_DATA', 'ID'
  ]

  const s_corresp_cols = [
    '_DESC_EXT_CORRESP_', '_DATA_INI_', '_DATA_FIM_', '_VALOR_MIN_', '_VALOR_MAX_', '_TITULAR_', '_BANCO_TITULAR_',
    'GRUPO', 'DESCRICAO', 'EVENTO', 'CONTRAPARTE', 'BANCO_CONTRAPARTE',	'ID'
  ]

  const s_saida = ssheet.get_nova_sheet({
    aba_nome: `COMPARAR_P - ${util.get_data_hora()}`,
    colunas: s_saida_cols
  })  
  
  const s_alvo = ssheet.get_sheet({
    aba_nome: nome_aba_alvo,
    cols_esperadas: s_alvo_cols,
    pode_extras: true,
  })

  const s_corresp = ssheet.get_sheet({
    aba_nome: nome_aba_corresp,
    cols_esperadas: s_corresp_cols,
    pode_extras: false
  })


  s_alvo.para_cada_linha({
    callback: para_cada_linha_alvo_cb
  })    
  
  function para_cada_linha_alvo_cb({linha: linha_alvo}){

    /** @type {wraps.Sheets.Ssheet.Sheet.linha | void} */
    const _linha_corresp = get_linha_correspondente({ linha_alvo, s_corresp})
    
    // Capturar Valores para a nova linha da s_saida
    /** @type {{[key: string]: wraps.Sheets.Ssheet.Sheet.cel}} */
    const l_saida_cels = s_saida.cols.reduce((saida_cels, saida_col) => {
      
      let cel

      if(_linha_corresp)
        try {cel = _linha_corresp.get_cel(saida_col.nome)} catch{} // nem todas as linhas contendo na sheet saida vai ter na sheet corresps 
      
      if (!cel) 
        try {cel = linha_alvo.get_cel(saida_col.nome)} catch{}
      
      saida_cels[saida_col.nome] = {
        valor: cel.valor,
        range: cel.range
      }

      return saida_cels
    }, {})
    
    
    /** @type {wraps.Sheets.Ssheet.Sheet.linha} */
    const linha_saida = s_saida.append_linha({cels: l_saida_cels})
    
    // assimilar as abas corresps, alvo e saida atravez das colunas IDs
    const alvo_ID_range = linha_alvo.get_cel('ID').range

    const alvo_ID = wraps.Sheets.util.check_set_UUID({ID_range: alvo_ID_range })

    linha_saida
    .get_cel('ALVO_ID')
    .range
    .setValue(alvo_ID)  
  
    linha_saida 
    .get_cel('CORRESP_DATA')
    .range
    .setValue(util.get_data_hora())
    
    if(_linha_corresp){

      const _corresp_ID = wraps.Sheets.util.check_set_UUID({
        ID_range:  _linha_corresp.get_cel('ID').range
      })

      linha_saida
      .get_cel('CORRESP_ID')
      .range
      .setValue(_corresp_ID)
    }
  }



  ////////////////////////////////////
  // checar correspndencia entre linhas:
  /** @type {app.extratos.atribuir_corresps.get_linha_correspondente} */
  function get_linha_correspondente ({linha_alvo, s_corresp}){
    
    /// LINHA_ALVO valores
    const desc_extrato = linha_alvo
    .get_cel('DESC_EXTRATO')
    .range
    .getValue()
  
    const data = linha_alvo
    .get_cel('DATA')
    .range
    .getValue()
  
    const valor = util.money_to_n( linha_alvo
      .get_cel('VALOR')
      .range
      .getValue()
    )
    
    const titular = linha_alvo
    .get_cel('TITULAR')
    .range
    .getValue()
    
    const banco_titu = linha_alvo
    .get_cel('BANCO_TITU')
    .range
    .getValue()
  
    //
    s_corresp.para_cada_linha({
      callback: para_cada_linha_corresp_cb 
    })
  
    function para_cada_linha_corresp_cb({linha: _linha}){
  
      const todas_cel_condicao_vazias = s_corresp.cols
      .filter(col => col.nome[0] === '_')
      .every(col => !_linha.get_cel(col.nome).valor) 
    
      if(todas_cel_condicao_vazias) return 
      
      // LINHA_CORRESP valores
      const _desc_extrato = _linha
      .get_cel('_DESCRICAO_EXTRATO_CORRESP_')
      .range
      .getValue()
  
      const _data_ini = _linha
      .get_cel('_DATA_INI_')
      .range
      .getValue()
    
      const _data_fim = _linha
      .get_cel('_DATA_FIM_')
      .range
      .getValue()
  
      const _valor_min = util.money_to_n(_linha
        .get_cel('_VALOR_MIN_')
        .range
        .getValue()
      )
    
      const _valor_max = util.money_to_n(_linha 
        .get_cel('_VALOR_MAX_')
        .range
        .getValue()
      )
    
      const _titular = linha_alvo
      .get_cel('_TITULAR_')
      .range
      .getValue()
    
      const _banco_titu = _linha
      .get_cel('_BANCO_TITU_')
      .range
      .getValue()
    
    
      const condicoes = [
        () => _data_ini ? data >= _data_ini : true,
        () => _data_fim ? data <= _data_fim : true,
        () => _valor_min ? valor >= _valor_min : true,
        () => _valor_max ? valor <= _valor_max : true,
        () => _banco_titu ? _banco_titu === banco_titu : true,
        () => _titular ?  titular === _titular : true,
        () => _desc_extrato ? descricoes_correspondem({
          desc_extrato_corresp: _desc_extrato,  
          descricao: desc_extrato
        }) : true, 
      ]
    
      if (condicoes.every(cond => cond())) return _linha 
    }
  }
    
  
  /** @type {app.extratos.atribuir_corresps.descricoes_correspondem}  */
  function descricoes_correspondem({desc_extrato_corresp, descricao}){
    
    // lidar com parenteses
    const reg_match_entre_parenteses = /\(([^()]*)\)/g

    /** @type {{com_parenteses: string, sem_parenteses: string}[]} */
    const matches = []

    /** @type {RegExpExecArray | null} */
    let match 
  
    while ((match = reg_match_entre_parenteses.exec(desc_extrato_corresp)) !== null){
      matches.push({
        com_parenteses: match[0],
        sem_parenteses: match[1]
      })
    }
  
    for (const m of matches){
      
      const sub_desc_corresponde = descricoes_correspondem({
        desc_extrato_corresp: m.sem_parenteses, 
        descricao
      })
  
      const str_bool = sub_desc_corresponde
      ? '_true_'
      : '_false_'
  
      desc_extrato_corresp.replace(m.com_parenteses, str_bool)
    }
    
    // retornar analise dos correspondentes e condicoes or e and
    return desc_extrato_corresp.split('||').some(sub_desc_corresp => {
      const sub = sub_desc_corresp.trim()
      if (sub === '_true_') return true
      if (sub === '_false_') return false
  
      return sub_desc_corresp.split('&&').every(dc_and => {
        if (sub === '_true_') return true
        if (sub === '_false_') return false
  
        return dc_and.match(descricao)
      })
    })
    

  }
}
    



