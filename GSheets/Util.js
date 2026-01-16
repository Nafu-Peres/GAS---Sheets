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



