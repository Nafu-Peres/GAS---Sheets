export {}

declare global{
    namespace GSheets{
        
        namespace Util{
            //  
            type get_a1_notation = (params: {
                col_posicao: number,
                linha_pos: number
            }) => string
    
            //  
            type link_to_id = (params: {
                link: string,
            }) => string
    
            //
            type set_range_value = (params: {
                sheet: GoogleAppsScript.Spreadsheet.Sheet, 
                l_pos: number, 
                l_quant?: number, 
                col_pos?: number, 
                col_quant?: number,
                valor: any,
                cor_fundo: string,   
            }) => void
        }
    }
}
