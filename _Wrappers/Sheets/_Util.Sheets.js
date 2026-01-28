// @ts-check
// @ts-ignore
util.wraps = util.wraps || {}
util.wraps.Sheets = {}


/**
 *  @type {(params: {
 *  ID_range: GoogleAppsScript.Spreadsheet.Range
 * }) => string} 
 * 
*/
util.wraps.Sheets.check_set_UUID = ({ID_range}) => {
    
    let id = ID_range.getValue()
    
    if(!util.isUUID({str: id})){
        id = Utilities.getUuid()
        ID_range.setValue(id)
    }

    return id
}  


util.wraps.Sheets._Test_helper_ = ({g_ssheet}) => {
    
    const aba_teste_nome_prefixo = "__teste__"
    
    function get_aba_nome_teste () {
        return `${aba_teste_nome_prefixo} - ${util.get_data_hora()}`
    }

    function deletar_sheets_teste(){ 
        g_ssheet.getSheets().map(g_s => {
            if(g_s.getName().includes(aba_teste_nome_prefixo)){
                g_ssheet.deleteSheet(g_s)
            }
        })
    }
    
    /** 
     * @type {(params: {
     * cols?: string[], 
     * valores?: any[][],
     * }) => GoogleAppsScript.Spreadsheet.Sheet} 
     * */
    function get_nova_sheet_teste({cols = [], valores = [[]]}){

            const g_s = g_ssheet.insertSheet(
                get_aba_nome_teste()
            )
            
            if(cols.length) g_s
                .getRange(1, 1, 1, cols.length)
                .setValues([cols])
            
            
            if(valores[0].length) g_s
                .getRange(2, 1, valores.length, valores[0].length)
                .setValues(valores)

            return g_s
    }

    return {
        get_aba_nome_teste,
        get_nova_sheet_teste,
        deletar_sheets_teste,    
    }
}



