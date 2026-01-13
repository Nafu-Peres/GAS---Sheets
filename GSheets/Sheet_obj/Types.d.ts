export {}


declare global{
    
    namespace Sheet_obj{
        
        namespace Index{
            
            type cel_obj = {
                valor: any,
                a1_pos: string,
                set_valor: (params:{valor: any, cor_fundo: string}) => void
            }

            type col_obj = {
                nome: string,
                index: number,
                pos: number,
                a1_pos: string,
            }

            type linha_obj = {
                index: number,
                pos: number,
                valor: any[],
                set_valor: (params:{valor: any, cor_fundo: string}) => void,
                get_cel: (params: {col_nome: string}) => cel_obj
            }

            type sheet_obj = {
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                linhas: linha_obj[],
                cols: col_obj[],
            }

            // GET // GET // GET // GET
            type get_sheet_obj = ( params: {
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                get_a1_notation: Sheet_obj.Util.get_a1_notation, 
                set_range_value: Sheet_obj.Util.set_range_value,
            }) => sheet_obj
        }

        
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

