function hello(){
    const sheet_geral = SpreadsheetApp
    .openByUrl('https://docs.google.com/spreadsheets/d/1y_ENkywbM9o1yRModLdFStCnit4nCkwlBkTX_kx2hAQ/edit?usp=drive_link')
    .getSheetByName('Geral')

    const s = Sheet_obj({sheet: sheet_geral})

    for (const L of s.linhas){
      const valor = L.get_cell({col_nome: 'VALOR'}).range.getValue() 

        console.log()

    }
}