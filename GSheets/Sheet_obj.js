// @ts-check

/**
 * @type {Gsheet.Sheet_obj.Sheet_obj}
 */
function Sheet_obj({
  sheet, 
  colunas: cols_esperadas = [], 
}){
  
  
  const [tabela_cols_valores] = sheet
  .getRange(1, 1, 1, cols_esperadas.length)
  .getValues()
  
  const cols_extras = tabela_cols_valores.filter(s_col => (
    !cols_esperadas.includes(s_col)
  ))

  const cols_faltantes = cols_esperadas.filter(col_esp => (
    !tabela_cols_valores.includes(col_esp)
  ))

  if(cols_extras.length || cols_faltantes.length){

    throw new Error(`
      Colunas da tabela "${sheet.getName()}" não correspondem ao esperado

        - colunas faltantes = ${cols_faltantes.length ? cols_faltantes : '-'} 

        - colunas extras = ${cols_extras.length ? cols_extras : '-'}

        - colunas esperadas = ${cols_esperadas}
      
        *lembre de sempre colocar a primeira celula da tabela (canto superior direito) na celula "A1"
      `
    )

  }


  const cols = cols_esperadas
  .map( col_nome => {
  
    const col_pos = tabela_cols_valores.indexOf(col_nome) +1

    return {
      nome: col_nome,
      col_pos,
      range: sheet.getRange(1, col_pos),
      linhas_range: sheet.getRange(2, col_pos, sheet.getLastRow(), 1)
    }
  })

  /**
   * @param {{row_n: number}} param0 
   * @returns {Gsheet.Sheet_obj.linha_obj}
  */
  function Linha_obj({row_n}){

    const linha_range = sheet.getRange(row_n, 1, 1, sheet.getLastColumn())
    const [linha_valores_arr] = linha_range.getValues()
        
    return {
      range: linha_range,
      valores: linha_valores_arr,
      get_cel: (col_nome) => Cel_obj(col_nome, row_n)
    }
  }

  /// CELULAS
  /**
  * @type {(col_nome: string, row_n: number) => Gsheet.Sheet_obj.cel_obj}
  */
  function Cel_obj(col_nome, row_n){

    const col = cols.find(c => c.nome === col_nome)
    
    if(!col) throw new Error(`
      Não foi possivel resgatar o objeto cell com o nome da coluna: 
        Nome da coluna não é valido 
        - nome passado: ${col_nome}
        - colunas do sheet: ${cols_esperadas}
    `)
    
    const cel_range = sheet.getRange(row_n, col.col_pos)
    
    return {
      range: cel_range,
      valor: cel_range.getValue()
    }
  }

  // LINHAS
  const linhas = []

  for (let row_n = 2; row_n < sheet.getLastRow(); row_n++){
    
    if(sheet.isRowHiddenByFilter(row_n) || sheet.isRowHiddenByUser(row_n))
      continue

    const linha = Linha_obj({row_n})
    linhas.push(linha)
  }



  /**
   * @type {Gsheet.Sheet_obj.append_linha} 
  */
  function append_linha({cels_obj= {}}){

    const linha_nova = Linha_obj({
      row_n: sheet.getLastRow() + 1
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
    sheet,
    linhas,
    cols,
    append_linha
  }
}
