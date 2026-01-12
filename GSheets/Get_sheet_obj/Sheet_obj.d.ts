export {}


declare global{
    namespace GSheets{
        
        namespace Sheet_obj{
            
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
                get_cel: (params: {col_nome}) => cel_obj
            }

            type sheet_obj = {
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                linhas: linha_obj[],
                cols: col_obj[],
            }
            

            // GET // GET // GET // GET
            type get_sheet_obj = ( params: {
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                get_a1_notation: GSheets.Util.get_a1_notation, 
                set_range_value: GSheets.Util.set_range_value,
            }) => sheet_obj
        }
    }
}