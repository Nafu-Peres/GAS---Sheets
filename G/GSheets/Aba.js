// @ts-check

/**
 * @type {Gsheet.Sheet_obj.Sheet_obj}
 */
function Tabela({
  sheet: s,
  colunas_esperadas: cols_esperadas = [], 
  colunas_sao_exclusivas: cols_sao_excl = true
}){
  
  
  const [s_cabecalho] = s
  .getRange(1, 1, 1, s.getLastColumn())
  .getValues()
  
  if(cols_esperadas.length){

    const cols_faltantes = cols_esperadas.filter(col_esp => (
      !s_cabecalho.includes(col_esp)
    ))
    
    let cols_extras = []
    if(cols_sao_excl){
      cols_extras = s_cabecalho.filter(s_col => (
        !cols_esperadas.includes(s_col)
      ))
    }

    if(cols_faltantes.length || (cols_sao_excl && cols_extras.length)){

      throw new Error(`
        Colunas da tabela "${s.getName()}" não correspondem ao esperado

          - colunas faltantes = ${cols_faltantes.length ? cols_faltantes : '-'} 
          
          ${cols_sao_excl
            ?`- colunas extras = ${cols_extras.length ? cols_extras : '-'}
            `
            : ''
          }
          - colunas esperadas = ${cols_esperadas}
        
          *lembre de sempre colocar a primeira celula da tabela (canto superior direito) na celula "A1"
        `
      )

    }
  }



  const cols = s_cabecalho
  .map(s_col => {
  
    const col_pos = s_cabecalho.indexOf(s_col) +1

    return {
      nome: s_col,
      col_pos,
      range: s.getRange(1, col_pos),
      linhas_range: s.getRange(2, col_pos, s.getLastRow(), 1)
    }
  })

  /**
   * @param {{row_n: number}} param0 
   * @returns {Gsheet.Sheet_obj.linha_obj}
  */
  function Linha({row_n}){

    const linha_range = s.getRange(row_n, 1, 1, s.getLastColumn())
    const [linha_valores_arr] = linha_range.getValues()
        
    return {
      range: linha_range,
      valores: linha_valores_arr,
      get_cel: (col_nome) => Cel(col_nome, row_n)
    }
  }

  /// CELULAS
  /**
  * @type {(col_nome: string, row_n: number) => Gsheet.Sheet_obj.cel_obj}
  */
  function Cel(col_nome, row_n){

    const col = cols.find(c => c.nome === col_nome)
    
    if(!col) throw new Error(`
      Não foi possivel resgatar o objeto cell com o nome da coluna: 
        Nome da coluna não é valido 
        - nome passado: ${col_nome}
        - colunas do sheet: ${cols_esperadas}
    `)
    
    const cel_range = s.getRange(row_n, col.col_pos)
    
    return {
      range: cel_range,
      valor: cel_range.getValue()
    }
  }

  // LINHAS
  const linhas = []

  for (let row_n = 2; row_n < s.getLastRow(); row_n++){
    
    if(s.isRowHiddenByFilter(row_n) || s.isRowHiddenByUser(row_n))
      continue

    const linha = Linha({row_n})
    linhas.push(linha)
  }



  /**
   * @type {Gsheet.Sheet_obj.append_linha} 
  */
  function append_linha({cels_obj= {}}){

    const linha_nova = Linha({
      row_n: s.getLastRow() + 1
    })

    const cels_entries = Object.entries(cels_obj)
    
    cels_entries.forEach ( ([col_nome, cel_obj]) => {
      linha_nova.get_cel(col_nome)
      .range
      .setValue(cel_obj.valor)
    })

    linhas.push(linha_nova)

    return linha_nova
  }

  // SHEET
  return {
    sheet: s,
    linhas,
    cols,
    append_linha
  }
}
