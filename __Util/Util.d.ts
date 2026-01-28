export {}



declare global{
    
    namespace util{
        
        type link_to_id = (params: {
            link: string
        }) => string

        type get_data_hora = () => string

        type isUUID = (params: {
            str: string
        }) => boolean

        type money_to_n = (params: {
            texto_monetario: string | number
        }) => number
        
        type _testar_ = (params: {
            descricao: string,
            resultado: any
            res_esperado: any,
        }) => void
    }
}

