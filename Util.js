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



/** @type {() => string} */
function get_data_hora(){
  return new Date().toLocaleString('sv', { hour12: false })
}





/** @type {(str: string) => boolean} */
function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}




/** @type {(texto_monetario: string | number) => number} */
function money_to_n(texto_monetario){
  
  if(!texto_monetario ) 
    return 0
  
  if(typeof texto_monetario === 'number') 
    return texto_monetario

  texto_monetario = texto_monetario
    .replace(/[^\d,-]/g, '')
      .replace(',','.')

  try{
    return  Number(texto_monetario)
  
  }catch(e){

    throw new Error(`
      Não foi possivel converter texto de valor monetario em numero
      texto moentario = ${texto_monetario}
    `)
  }
}