// @ts-check

/**
 * @type {Gsheet.Sheet_obj.Sheet_obj}
 */
function Sheet_obj({
  sheet, 
  cols_obrigatorias = [], 
}){
  
  // COLUNAS
  const cols_nomes = sheet
  .getRange(1, 1, 1, sheet.getLastColumn())
  .getValues()[0] // [][] => []
  .filter((_,index) => !sheet.isColumnHiddenByUser(index + 1))
  .map((col_nome, index) => {
    
    col_nome = col_nome
    .toString()
    .trim()

    if(!col_nome) throw new Error(`
      Nome da coluna não pode ser vazia/ nulo
      posicao da coluna vazia: ${index + 1}  
    `)

    return col_nome
  })

  const cols_faltantes = cols_obrigatorias
  .map(col_obg => !cols_nomes.includes(col_obg))
      
  if(cols_faltantes.length){
    throw new Error(`
      Uma ou mais coluna obrigatória não esta presente na planilha ${sheet.getName()}
      cols_faltantes: ${cols_faltantes};
      cols_obrigatorias: ${cols_obrigatorias}
    `)
  }

  const cols = cols_nomes
  .map((nome, index) => {
  
    const col_pos = index + 1
    
    return {
      nome,
      col_pos,
      range: sheet.getRange(1, col_pos),
      linhas_range: sheet.getRange(2, col_pos, sheet.getLastRow(), 1)
    }
  })


  // LINHAS
  const linhas = []

  for (let row_n = 2; row_n < sheet.getLastRow(); row_n++){
    
    if(sheet.isRowHiddenByFilter(row_n) || sheet.isRowHiddenByUser(row_n))
      continue

    linhas.push(get_linha({row_n}))
  }

  /**
   * @param {{row_n: number}} param0 
   * @returns {Gsheet.Sheet_obj.linha_obj}
  */
  function get_linha({row_n}){

    const linha_range = sheet.getRange(row_n, 1, 1, sheet.getLastColumn())
    const [linha_valores_arr] = linha_range.getValues()
        
    return {
      range: linha_range,
      valores: linha_valores_arr,
      get_cel: (col_nome) => get_celula(col_nome, row_n)
    }
  }

  /**
   * @type {Gsheet.Sheet_obj.append_linha} 
  */
  function append_linha({cels_obj= {}}){

    const linha_nova = get_linha({
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


  /// CELULAS
  /**
  * @type {(col_nome: string, row_n: number) => Gsheet.Sheet_obj.cel_obj}
  */
  function get_celula(col_nome, row_n){

    const col = cols.find(c => c.nome === col_nome)
    
    if(!col) throw new Error(`
      Não foi possivel resgatar o objeto cell com o nome da coluna: 
        Nome da coluna não é valido 
        - nome passado: ${col_nome}
        - colunas do sheet: ${cols_nomes}
    `)
    
    const cel_range = sheet.getRange(row_n, col.col_pos)
    
    return {
      range: cel_range,
      valor: cel_range.getValue()
    }
  }


  // SHEET
  return {
    sheet,
    linhas,
    cols,
    append_linha
  }
}
