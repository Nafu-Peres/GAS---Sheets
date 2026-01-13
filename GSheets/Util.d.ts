export {}



declare global{
    
    namespace Gsheet{
        
        namespace Util{    
            //  
            type link_to_id = (params: {
                link: string,
            }) => string
            //
            type cell_obj = {
                col_nome: string,
                range: GoogleAppsScript.Spreadsheet.Range,
            }
            //
            type linha_obj = {
                range: GoogleAppsScript.Spreadsheet.Range,
                valores: any[],
                get_cell: (params:{
                    col_nome: string
                }) => cell_obj
            }
            //
            type sheet_obj = {
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                linhas: linha_obj[],
                cols_nomes: string[]
            }
            //
            type Sheet_obj = (params: {
                sheet: GoogleAppsScript.Spreadsheet.Sheet | null,
            }) => sheet_obj
        }
    }
}

