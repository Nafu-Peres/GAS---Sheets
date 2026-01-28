// @ts-check

/**@type {util.link_to_id}*/
util.link_to_id = ({link}) => {

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


/**@type {util.get_data_hora} */
util.get_data_hora = () => {
  return new Date().toLocaleString('sv', { hour12: false })
}

/**@type {util.isUUID} */
util.isUUID = ({str}) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)
}


/**@type {util.money_to_n} */
util.money_to_n = (texto_monetario) => {
  
  if(!texto_monetario ) 
    return 0
  
  if(typeof texto_monetario === 'number') 
    return texto_monetario


  texto_monetario = texto_monetario
  //@ts-ignore
  .replace(/[^\d,-]/g, '')
  .replace(',','.')

  try{
    return  Number(texto_monetario)
  
  }catch(e){

    throw new Error(`
      Não foi possivel converter texto de valor monetario em numero
      texto moentario = ${texto_monetario}
      mensagem de erro = ${e.message}
    `)
  }
}




util.is_plain_obj = (value) => {
  // Verifica se é um objeto (não primitivo) e não é null
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  // Verifica se é realmente um Object (elimina Arrays, Dates, etc.)
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }
  
  // Obtém o protótipo do objeto
  const proto = Object.getPrototypeOf(value);
  
  // Se não tem protótipo (Object.create(null)), é plain object
  if (proto === null) {
    return true;
  }
  
  // Verifica se o construtor do protótipo é a função Object nativa
  const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  
  return (
    typeof Ctor === 'function' &&
    Ctor === Object // Verifica se é exatamente o construtor Object
  );
}




util._testar_ = ({teste_obj, _nivel = 0}) => {

    const teste_entries = Object.entries(teste_obj)

    for (let [descricao, teste] of teste_entries){
    
      
    if(typeof teste !== "function") throw new Error(`
      Erro: todos os valores dos teste_obj devem ser funcoes: () => boolean | teste_obj 
      `)
        
    const tracos = " -".repeat(_nivel)

    let res
    try {
      res = teste()
    }catch(e){
      throw new Error (`
        ${tracos} 💔: ${descricao} 
        Erro durante a execução: 
        mensagem de erro: ${e.message}
        detalhes?: ${e.details}
        `)
    }
    
    if(util.is_plain_obj(res)){
      
      const _n = _nivel + 1 
      
      console.log(`${" -".repeat(_n)} 🖤: ${descricao}`)

      util._testar_({
        teste_obj: res, 
        _nivel: _n
      })
      continue
    }
    
    if(res === false){
      console.error(`${tracos} 💔: ${descricao}`) 
      continue
    }

    if(res === true){
      console.log(`${tracos} 💚: ${descricao}`)
      continue
    }

    throw new Error(`
        Erro: ${descricao} 
        Os retornos das funcoes testes podem apenas ser 
        - valores booleanos
        - objetos teste_obj`
    )

  }
}




// passar no primeiro nivel dos entries teste_obj : {descrição: () => boolean, plain_object }

// loggar descricao

// checar se o valor da entrie é uma funcao, se não for, jogar erro

// rodar funcao,
    // se devolver boolean ... analisa teste
    // se delvolver plain_obj ... loop na funcao
