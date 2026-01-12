// @ts-check

/**
 * @type {GSheets.Sheet_obj.get_sheet_obj}
 */
function get_sheet_obj({
  sheet,
  get_a1_notation, 
  set_range_value,
}){

    if(!sheet) throw new Error(`
      sheet não pode ser um valor vazio
      sheet = ${sheet}  
    `)

    // serpando a primeira linha da planilha como cabecalho, 
    // ja que .getValues() retorna uma array bidimenssona dos dados da planilha
    const [cabecalho, ...linhas_valores] = sheet
    .getDataRange()
    .getValues()


    // CABECALHO  
    /**
     * @type {GSheets.Sheet_obj.col_obj[]} 
    */
    const cols = cabecalho
    .map((nome, index) => {

      nome = nome.toString().toUpperCase()
      const pos = index +1

      return {
        nome,
        index,
        pos,
        a1_pos: get_a1_notation({
          col_posicao: pos, 
          linha_pos: 1
        })
      }
    })


    // LINHAS
    /**
     * @type {GSheets.Sheet_obj.linha_obj[]}
     */
    const linhas = linhas_valores.map((linha_valores, index) => {
      
      // l_index + 1 para compensar a linha do cabacalho que foi retirado em [cols, ...linhas_valores]
      index = index +1
      const pos = index +1

      const linha_celulas = get_linha_celulas({cols, linha_valores, l_pos: pos})
      
      
      // @ts-ignore
      const set_valor = ({valor, cor_fundo}) => {
        return set_range_value({
          sheet,
          l_pos: pos,
          col_quant: sheet.getLastColumn(),
          valor, 
          cor_fundo
        }) 
      } 

      // @ts-ignore
      const get_cel = ({col_nome}) => {
        
        const cel = linha_celulas?.[col_nome]
        if(!cel) throw new Error (`
          Não foi possivel resgatar o objeto celula:
          Não existe a coluna "${col_nome}"  
        `)

        return cel
      }

      // linha {}
      return { 
        index,
        pos,
        valor: linha_valores,
        set_valor,
        get_cel,
      }
    })


    // CELULAS

    // @ts-ignore
    function get_linha_celulas({cols, linha_valores, l_pos}){
      
      // @ts-ignore
      return cols.reduce((lxc, col) => {
        
        const a1_pos = get_a1_notation({
          col_posicao: col.col_pos,
          linha_pos: l_pos,
        }) 


        // @ts-ignore
        function set_valor({valor, cor_fundo}){
          return set_range_value({
            sheet,
            valor,
            cor_fundo, 
            l_pos,
            col_pos: col.col_pos,
          })
        }
        
        const valor = linha_valores[col.col_index]

        lxc[col.nome] = {
          valor,
          a1_pos,
          set_valor 
        }

        return lxc
      }, {})
    }

    const sheet_obj = {
      sheet,
      linhas,
      cols
    }
  
    return sheet_obj
}







