export {}


declare global{

    namespace Extratos{

        namespace CC {
            
            type cc_fn = (params: {

            }) => void

            type CC = (params: {
                sheet_alvo_col_alvo: string, 
                sheet_alvo_cols_nomes: string[], 
                corresp_col: string
            }) => cc_fn

        }

    }

}