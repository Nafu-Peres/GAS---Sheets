// @ts-check


/**
 *  @type {GSheets.Util.link_to_id}
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
 * @type {GSheets.Util.get_a1_notation} 
 */
function get_a1_notation({col_posicao, linha_pos}){

  const ABC = [
    "A", "B", "C", "D", "E", 
    "F", "G", "H", "I", "J", 
    "K", "L", "M", "N", "O", 
    "P", "Q", "R", "S", "T", 
    "U", "V", "W", "X", "Y", 
    "Z"
  ]

  const abc_len = ABC.length

  // +1 para evitar que a col_posicao 26 gere 1 retorno
  const retornos = Math.floor(col_posicao / (abc_len + 1)) 
  
  let col_letras = []
  
  for(let i = -1; i < retornos; i++){
    
    // -1 para compensar o base 0 do array[index]
    const l_index = (col_posicao % abc_len) -1
    const letra = ABC.at(l_index)

    col_letras.push(letra)
  }
  
  const col_letrass = col_letras.join('')

  return col_letrass + linha_pos
}




/**
 * @type {GSheets.Util.set_range_value} 
 */
function set_range_value({
  sheet, 
  l_pos, 
  l_quant = 1, 
  col_pos = 1, 
  col_quant = 1, 
  valor,
  cor_fundo = '', 
}) {

    if(!l_pos) throw new Error(`
        l_pos (posicao em numero da linha da planilha) é obrigatorio
    `)

  const range = sheet.getRange(l_pos, col_pos, l_quant, col_quant)
  
  if (cor_fundo) range.setBackground(cor_fundo)
  range.setValue(valor)
}
