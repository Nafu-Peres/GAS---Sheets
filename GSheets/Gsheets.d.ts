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
            type cell_obj = {
                col_nome: string,
                range: GoogleAppsScript.Spreadsheet.Range,
                valor: any
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
                get_cell: (coluna_nome: string) => cell_obj
            }
            //
            type filtro_fn = (params: {
                linha: linha_obj,
                linhas?: linha_obj[],
                sheet?: GoogleAppsScript.Spreadsheet.Sheet,
            }) => boolean
            //
            type a_cada_l_cb_fn = (params: {
                linha: linha_obj,
                linhas?: linha_obj[],
                sheet?: GoogleAppsScript.Spreadsheet.Sheet,
            }) => void
            //
            type a_cada_l_fn = (params: {
                call_back: a_cada_l_cb_fn,
                filtros: filtro_fn[],
            }) => void
            //
            type append_linha_fn = (params: {
                cols_val: object 
            }) => void
            //
            type sheet_obj = {
                sheet: GoogleAppsScript.Spreadsheet.Sheet,
                linhas: linha_obj[],
                cols: col_obj[],
                a_cada_linha: a_cada_l_fn,
                append_linha,
            }
            //
            type Sheet_obj_fn = (params: {
                sheet: GoogleAppsScript.Spreadsheet.Sheet | null,
                cols_obrigatorias?: string [],
            }) => sheet_obj
        }
    }
}

