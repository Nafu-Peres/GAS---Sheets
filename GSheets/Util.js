// @ts-check

/**
 *  @type {Gsheet.Util.link_to_id}
 */
function link_to_id({link}) {
  const arq_padrao = /\/d\/(.*?)\//
  const pasta_padrao = /\/folders\/([^?/]+)/
  const arq_matches = arq_padrao.exec(link) || []
  const pasta_matches = pasta_padrao.exec(link) || []

  if (arq_matches.length) {

    return arq_matches[1]
  } else if (pasta_matches.length) {

    return pasta_matches[1]
  } else {
    
    throw new Error(`não foi possivel extrair o id do link: ${link}`)
  }
}



function get_data_hora(){
  return new Date().toLocaleString('sv', { hour12: false })
}

/**
 * @type {Gsheet.Util.Sheet_obj}
 */
function Sheet_obj({sheet: S}){
  
  if(!S){
    throw new Error(`
      sheet não deve ser nulo
    `)
  }

  /** * @type {any[]}*/
  const cols_nomes = S
  .getRange(1, 1, 1, S.getLastColumn())
  .getValues()[0] // any[][] -> any[]
  .map(nome => 
    nome
    .toString()
    .toUpperCase()
    .trim()
  )

  const linhas = []

  for (let row_n = 2; row_n < S.getLastRow(); row_n++){
    
    const linha_range = S.getRange(row_n, 1, 1, S.getLastColumn())
    const [linha_valores] = linha_range.getValues()
    

    linhas.push({
      range: linha_range,
      valores: linha_valores,
      get_cell,
    })

    function get_cell({col_nome}){
    
      const col_index = cols_nomes.indexOf(col_nome)

      if(col_index == -1) throw new Error(`
        Não foi possivel resgatar o objeto cell com o nome da coluna: 
          Nome da coluna não é valido 
          - nome passado: ${col_nome}
          - colunas do sheet: ${cols_nomes}
        `)
      
      // @ts-ignores
      const cell_range = S.getRange(row_n, col_index + 1)
      
      // cell_obj
      return {
        col_nome,
        range: cell_range,
      }
    }
  }

  // sheet_obj {}
  return {
    sheet: S,
    linhas,
    cols_nomes,
  }
}


