export {}



declare global{
    
    namespace Gsheet{
        
        namespace Util{    
            //  
            type link_to_id = (params: {
                link: string,
            }) => string

        }

        namespace Sheet_obj{
            //
            type cel_obj = {
                range: GoogleAppsScript.Spreadsheet.Range,
                valor: any
            }
            //
            type cels_obj = {
                [key: string] : cel_obj
            }
            //
            type col_obj = {
                nome: string,
                col_pos: number,
                range: GoogleAppsScript.Spreadsheet.Range,
                linhas_range: GoogleAppsScript.Spreadsheet.Range,
            }
            //
            type linha_obj = {
                range: GoogleAppsScript.Spreadsheet.Range,
                valores: any[],
                get_cel: (coluna_nome: string) => cel_obj
            }
            //
            type append_linha = (params: {
                cels_obj?: cels_obj 
            }) => linha_obj
            //
            type sheet_obj = {
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                linhas: linha_obj[],
                cols: col_obj[],
                append_linha: append_linha
            }
            //
            type Sheet_obj = (params:{
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                cols_obrigatorias?: string [],
            }) => sheet_obj
        }
    }
}

