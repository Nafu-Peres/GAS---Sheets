export {}



declare global{
    
    namespace wraps{
        
        namespace Sheets{

            namespace Ssheet{

                namespace dependencias{
                    //
                    type col = {
                        nome: string,
                        col_pos: number,
                        range: GoogleAppsScript.Spreadsheet.Range,
                        linhas_range: GoogleAppsScript.Spreadsheet.Range,
                    }
                    //
                    type cel = {
                        range: GoogleAppsScript.Spreadsheet.Range,
                    }
                    //
                    type linha = {
                        range: GoogleAppsScript.Spreadsheet.Range,
                        valores: any[],
                        get_cel: (coluna_nome: string) => cel
                    }
                    //
                    type sheet = {
                        g_sheet: GoogleAppsScript.Spreadsheet.Sheet,
                        cols: col[],

                        para_cada_linha: (params: {
                            callback: (params:{linha: linha}) => '_break_' | undefined | null | void
                        }) => void,

                        get_cols_faltantes: (params: {
                            cols_esperadas: string[]
                        }) => string[],

                        get_cols_extras: (params: {
                            cols_esperadas: string[]
                        }) => string[],
                        
                        /**
                         * cria uma nova linha no final da aaba, sendo possivel inserir valores na criação
                         * @parms params.valores - Objeto {"nome da coluna", "valor da celula"}
                         */
                        append_linha: (params: { 
                            valores?: { [key: string]: any } 
                        }) => linha
                    }
                }

                ////
                type ssheet = {
                    get_sheet: (params: {
                        aba_nome: string, 
                        cols_esperadas?: string[], 
                        pode_extras?: boolean 
                    }) => dependencias.sheet,
                    
                    get_nova_sheet: (params:{
                        aba_nome: string,
                        colunas?: string[]
                    }) => dependencias.sheet,
                    
                    g_ssheet: GoogleAppsScript.Spreadsheet.Spreadsheet
                }
            }                
        }
    }
}

