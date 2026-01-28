// @ts-check
// @ts-ignore
wraps.Sheets = wraps.Sheets || {} 
wraps.Sheets.SSheet = wraps.Sheets.SSheet || {}
wraps.Sheets.SSheet.dependencias = wraps.Sheets.SSheet.dependencias || {} 



////// COLS
/**
 * @type {(params: {
 *  g_sheet: GoogleAppsScript.Spreadsheet.Sheet
 * }) => wraps.Sheets.Ssheet.dependencias.col[]}
 */
wraps.Sheets.SSheet.dependencias.Cols = ({g_sheet}) => {

  /** @type {string[]} */
  const cols_nomes = g_sheet
  .getRange(1, 1, 1, g_sheet.getLastColumn())
  .getValues()[0]
  .filter((_, col_index) => {
    return !g_sheet.isColumnHiddenByUser(col_index + 1)
  })
  
  return cols_nomes
  .map(col_nome => {
  
    const col_pos = cols_nomes.indexOf(col_nome) +1

    return {
      nome: col_nome,
      col_pos,
      range: g_sheet.getRange(1, col_pos),
      linhas_range: g_sheet.getRange(2, col_pos, g_sheet.getLastRow(), 1)
    }
  })
}


////// CEL
/**
 * @type {(params: {
 *  g_sheet: GoogleAppsScript.Spreadsheet.Sheet,
 *  cols: wraps.Sheets.Ssheet.dependencias.col[],
 *  col_nome: string,
 *  row_n: number,
 * }) => wraps.Sheets.Ssheet.dependencias.cel}
 */
wraps.Sheets.SSheet.dependencias.Cel = ({g_sheet, cols, col_nome, row_n}) => {

  const col = cols.find(c => c.nome === col_nome)
  
  if(!col) throw new Error(`
    Não foi possivel resgatar o objeto cell com o nome da coluna: 
      Nome da coluna não é valido 
      - nome passado: ${col_nome}
      - colunas do sheet: ${cols.map(c => c.nome)}
  `)
  
  const cel_range = g_sheet.getRange(row_n, col.col_pos)
  
  return {
    range: cel_range,
  }
}




// LINHA
/**
 * @type {(params: {
 *  g_sheet: GoogleAppsScript.Spreadsheet.Sheet,
 *  cols: wraps.Sheets.Ssheet.dependencias.col[]
 *  row_n: number,
 * }) => wraps.Sheets.Ssheet.dependencias.linha}
 */
wraps.Sheets.SSheet.dependencias.Linha = ({g_sheet, row_n, cols}) => {
  
  const {Cel} = wraps.Sheets.SSheet.dependencias 

  const linha_range = g_sheet.getRange(row_n, 1, 1, g_sheet.getLastColumn())
  const [linha_valores_arr] = linha_range.getValues()
  
  const get_cel = (coluna_nome) => {
    
    return Cel({
      g_sheet, 
      cols, 
      col_nome: coluna_nome, 
      row_n
    })
  } 
     
  return {
    range: linha_range,
    valores: linha_valores_arr,
    get_cel,
  }
}




////// SHEET
/** 
 * @type {(params: {
 *  g_sheet: GoogleAppsScript.Spreadsheet.Sheet 
 * }) => wraps.Sheets.Ssheet.dependencias.sheet} 
 * */
wraps.Sheets.SSheet.dependencias.Sheet = ({g_sheet}) => {

  const {Cols, Linha } = wraps.Sheets.SSheet.dependencias

  const cols = Cols({g_sheet})
  const cols_nomes = cols.map(c => c.nome)
  const get_Linha = ({row_n}) => Linha({g_sheet, cols, row_n})

  function para_cada_linha({callback}){

    for (let row_n = 2; row_n < g_sheet.getLastRow(); row_n++){
      
      if(g_sheet.isRowHiddenByFilter(row_n) || g_sheet.isRowHiddenByUser(row_n))
        continue
      
      const linha = get_Linha({row_n})

      const break_cb = callback({linha})

      if(break_cb === '_break_') break 

      if(break_cb) throw new Error(`
        o unico valor não nulo a ser retornado pelo callback da "func para_cada_linha()" deve ser a string "_break_"
      `)
    }

  }

  
  function append_linha({valores= {}}){

    const linha_nova = get_Linha({
      row_n: g_sheet.getLastRow() + 1
    })

    const cels_entries = Object.entries(valores)
    
    cels_entries.forEach (([col_nome, cel]) => {
      
      const valor = cel.range.getValue()

      linha_nova.get_cel(col_nome)
      .range
      .setValue(valor)
    })

    return linha_nova
  }

  function get_cols_faltantes({cols_esperadas}){
    return  cols_esperadas.filter(col_esp => {
      return !cols_nomes.includes(col_esp)
    })
  } 

  function get_cols_extras({cols_esperadas}){
    return cols_nomes.filter(sheet_col => {
      return !cols_esperadas.includes(sheet_col)
    })
  }

  // SHEET
  return {
    g_sheet,
    cols,
    para_cada_linha,
    append_linha,
    get_cols_faltantes,
    get_cols_extras
  }
}






////// SSHEETS
/** 
 * @type {(p:{
 *  g_ssheet: GoogleAppsScript.Spreadsheet.Spreadsheet
 * }) => wraps.Sheets.Ssheet.ssheet}
 * */
wraps.Sheets.SSheet.SSheet = ({g_ssheet}) => {

  const {Sheet} = wraps.Sheets.SSheet.dependencias


  function get_nova_sheet({aba_nome, colunas}){

    const g_sheet = g_ssheet.insertSheet(aba_nome)
    
    g_sheet
    .getRange(1, 1, 1, colunas.length)
    .setValues([colunas])
    
    return Sheet({g_sheet})
  }


  /** @param {{aba_nome: string, cols_esperadas?: string [], pode_extras?: boolean}} param */
  function get_sheet({aba_nome, cols_esperadas = [], pode_extras = true}){
      
    const g_sheet = g_ssheet.getSheetByName(aba_nome)
    
    if(!g_sheet) throw new Error(`
      Não foi possivel abrir a aba de nome ${aba_nome}
      abas disponiveis = ${g_ssheet.getSheets().map(sheet => sheet.getName())}
    `)
    
    const sheet = Sheet({g_sheet})

    if (cols_esperadas.length){

      const faltantes = sheet.get_cols_faltantes({cols_esperadas})        

      let extras = []
      if(!pode_extras){
        extras = sheet.get_cols_extras({cols_esperadas})
      }
      

      if(faltantes.length || extras.length){
        throw new Error(`
          Colunas da tabela "${g_sheet.getName()}" não correspondem ás colunas esperadas
          -colunas faltantes = ${faltantes}  
          ${!pode_extras ? `-colunas extras = ${extras}` : ''}  
          -colunas esperadas = ${cols_esperadas}
          -colunas presentes = ${sheet.cols.map(c => c.nome)}

          * lembre-se de:
            - Sempre colocar a primeira celula da tabela na posicao "A1" do sheets 
            - NÃO esconder/ ocultar as colunas necessarias`
        )
      }
    }

    return sheet
  }

  return {
    g_ssheet,
    get_sheet,
    get_nova_sheet,
  }
}

