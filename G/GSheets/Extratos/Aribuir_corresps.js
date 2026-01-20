// @ts-check


/** @type {Extratos.At_corresps.AT_CORRESPS} */
function COMPARAR_CORRESPS({sheet_alvo, sheet_corresp}){

  const s_saida_cols = [
    'DATA', 'GRUPO', 'DESCRICAO', 'DESCRICAO_EXTRATO', 'EVENTO', 'TITULAR', 'BANCO_TITULAR', 'CC', 'VALOR', 'CONTRAPARTE', 'BANCO_CONTRAPARTE', '_CORRESP_ANALISE_DATA_', '_CORRESP_LINHA_', 'ID'
  ]

  const s_alvo_cols = [
    'DATA',	'DESCRICAO_EXTRATO', 'TITULAR',	'BANCO_TITULAR', 'CC',	'VALOR', '_CORRESP_LINHA_', '_CORRESP_DATA_'		
  ]

  const s_corresp_cols = [
    '_DESC_EXT_CORRESP_', '_DATA_INI_', '_DATA_FIM_', '_VALOR_MIN_', '_VALOR_MAX_', '_TITULAR_', '_BANCO_TITULAR_',
    'GRUPO', 'DESCRICAO', 'EVENTO', 'CONTRAPARTE', 'BANCO_CONTRAPARTE',	'ID'
  ]
  
  /** @type {Gsheet.Sheet_obj.sheet_obj} */
  const s_alvo = Tabela({
    sheet: sheet_alvo,
    colunas: s_alvo_cols,
  })

  /** @type {Gsheet.Sheet_obj.sheet_obj} */
  const s_corresp = Tabela({
    sheet: sheet_corresp,
    colunas: s_corresp_cols
  })

  const sheet_saida = SpreadsheetApp
  .getActiveSpreadsheet()
  .insertSheet(`COMPARAR_P - ${get_data_hora()}`)

  sheet_saida
  .getRange(1, 1, 1, s_alvo_cols.length)
  .setValues([s_saida_cols])

  /** @type {Gsheet.Sheet_obj.sheet_obj} */
  const s_saida = Tabela({
    sheet: sheet_saida,
    colunas: s_alvo_cols
  })  

  //
  for (const linha_alvo of s_alvo.linhas){

    /** @type {Gsheet.Sheet_obj.linha_obj | undefined} */
    const _linha_corresp = get__linha_correspondente({linha: linha_alvo, s_corresp})
    
    // CAPTURAR VALORES PARA LINHA SAIDA
    /** @type {Gsheet.Sheet_obj.cels_obj} */
    const l_saida_cels = s_saida.cols.reduce((s_cels, s_col) => {
      
      let cel

      if(_linha_corresp)
        try {cel = _linha_corresp.get_cel(s_col.nome)} catch{}
      
      if (!cel) 
        cel = linha_alvo.get_cel(s_col.nome)// nap precisa de try catch; colunas de s_alvo === s_saida

      s_cels[s_col.nome] = {
        valor: cel.valor,
        range: cel.range
      }

      return s_cels
    }, {})
    

    /** @type {Gsheet.Sheet_obj.linha_obj} */
    const linha_saida = s_saida.append_linha({cels_obj: l_saida_cels})

    try {
      const alvo_ID_cel = linha_alvo.get_cel('ID')

      let alvo_ID = alvo_ID_cel.valor

      if(!isUUID(alvo_ID)){
        alvo_ID = Utilities.getUuid()
        alvo_ID_cel.range.setValue(alvo_ID)
      }

      linha_saida
        .get_cel('ID').range.
          setValue(alvo_ID)  

    }catch{}
    

    linha_saida
      .get_cel('_CORRESP_ANALISE_DATA_')
        .range
          .setValue(get_data_hora())
    
    if(_linha_corresp){
      linha_saida
        .get_cel('_CORRESP_LINHA_')
          .range
            .setValue(linha_saida.range.getRow())
    }
  }

  s_saida.sheet.activate()
}




// checar correspndencia entre linhas:
/** 
 * @param {{
  * linha: Gsheet.Sheet_obj.linha_obj
  * s_corresp: Gsheet.Sheet_obj.sheet_obj
  * }} param
*/
function get__linha_correspondente ({linha, s_corresp}){

  const desc_extrato = linha
    .get_cel('DESC_EXTRATO').valor

  const data = linha
    .get_cel('DATA').valor

  const valor = money_to_n(
    linha
    .get_cel('VALOR').valor
  )
  
  const titular = linha
    .get_cel('TITULAR').valor
  
  const banco_titu = linha
    .get_cel('BANCO_TITU').valor

  //  
  for (const _linha of s_corresp.linhas){
  
    const todas_cel_condicao_vazias = s_corresp.cols
      .filter(col => col.nome[0] === '_')
        .every(col => !_linha.get_cel(col.nome).valor) 

    if(todas_cel_condicao_vazias) continue

    const _descricao = _linha
      .get_cel( '_DESCRICAO_').valor

    const _data_ini = _linha
      .get_cel('_DATA_INI_').valor

    const _data_fim = _linha
      .get_cel('_DATA_FIM_').valor 

    const _valor_min = money_to_n(
      _linha
      .get_cel('_VALOR_MIN_').valor
    )

    const _valor_max = money_to_n( 
      _linha
      .get_cel('_VALOR_MAX_').valor
    )

    const _titular = linha
      .get_cel('_TITULAR_').valor

    const _banco_titu = _linha
      .get_cel('_BANCO_TITU_').valor


    const condicoes = [
      () => _data_ini ? data >= _data_ini : true,
      () => _data_fim ? data <= _data_fim : true,
      () => _valor_min ? valor >= _valor_min : true,
      () =>_valor_max ? valor <= _valor_max : true,
      () => _banco_titu ? _banco_titu === banco_titu : true,
      () => _titular ?  titular === _titular : true,
      () => _descricao ? descricoes_correspondem({
        desc_corresp: _descricao,  
        descricao: desc_extrato
      }) : true, 
    ]

    if (condicoes.every(cond => cond())) return _linha 
  }
}


/** 
 * @param {{
 * desc_corresp: string, 
 * descricao: string
 * }} params 
*/
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
