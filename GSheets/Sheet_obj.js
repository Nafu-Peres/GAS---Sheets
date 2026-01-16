// @ts-check

/**
 * @type {Gsheet.Sheet_obj.Sheet_obj_fn}
 */
function Sheet_obj({sheet, cols_obrigatorias = [], filtros = []}){
  
  if(!sheet){
    throw new Error(`
      sheet não deve ser nulo
    `)
  }
  
  const cols_nomes = sheet
  .getRange(1, 1, 1, sheet.getLastColumn())
  .getValues()[0] // any[][] -> any[]
  .map((nome, index) => {
    
    nome = nome
    .toString()
    .trim()

    if(!nome) throw new Error(`
      Nome da coluna não pode ser vazia/ nulo
      posicao da coluna vazia: ${index + 1}  
    `)

    return nome
  })

  const cols_faltantes = cols_obrigatorias.map(col_obg => !cols_nomes.includes(col_obg))
      
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



  const linhas = []

  for (let row_n = 2; row_n < sheet.getLastRow(); row_n++){
    
    linhas.push(get_linha({ row_n, }))
  }


  function get_linha({row_n}){
    // @ts-ignore
    const linha_range = sheet.getRange(row_n, 1, 1, sheet.getLastColumn())
    const [linha_valores_arr] = linha_range.getValues()
    
    const _cels_ = cols.reduce((_c_, col) => {

      const cel_range = sheet?.getRange(row_n, col.col_pos)

      _c_[col.nome] = {
        col_nome: col.nome,
        range: cel_range,
        valor : cel_range?.getValue() 
      }

      return _c_
    }, {})


    const get_cel = (col_nome) => {
    
        const cel = _cels_[col_nome]
        if(cel) return cel

        throw new Error(`
          Não foi possivel resgatar o objeto cell com o nome da coluna: 
            Nome da coluna não é valido 
            - nome passado: ${col_nome}
            - colunas do sheet: ${cols_nomes}
        `)
    }
    
    //linha_obj
    const linha = {
      range: linha_range,
      valores: linha_valores_arr,
      get_cell: get_cel
    }

    if (filtros.every(f => f({linha:linha}))) return linha
  }


  const append_linha = ({cols_val= {}}) => {
      // @ts-ignore
      const linha_nova = get_linha({
        row_n: sheet.getLastRow() + 1
      })

      const cv_entries = Object.entries(cols_val)
      
      cv_entries.forEach ((col_nome, valor) => {
        // @ts-ignore
        linha_nova.get_cell({col_nome})
        .range
        .setValue(valor)
      })

      linhas.push(linha_nova)

      return linha_nova
    }

  // sheet_obj {}
  return {
    sheet: sheet,
    linhas,
    cols,
    append_linha
  }
}
