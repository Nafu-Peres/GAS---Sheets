export {}


declare global{

    namespace app {
        
        namespace extratos{

            namespace atribuir_corresps {
                
                type atribuir_corresps = (params: {
                    nome_aba_alvo: string,
                    nome_aba_corresp: string,
                    ssheet: wraps.Sheets.Ssheet.ssheet
                }) => void
                
                type get_linha_correspondente = (params: {
                    linha_alvo: wraps.Sheets.Ssheet.Sheet.linha,
                    s_corresp: wraps.Sheets.Ssheet.Sheet.sheet,
                }) => wraps.Sheets.Ssheet.Sheet.linha | void

                type descricoes_correspondem = (params: {
                    desc_extrato_corresp: string,
                    descricao: string,
                }) => boolean

                
            }

        }        
    }

}