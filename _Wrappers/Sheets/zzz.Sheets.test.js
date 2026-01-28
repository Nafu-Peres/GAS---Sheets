// @ts-check
//@ts-ignore
_test_.wraps = _test_.wraps || {}
_test_.wraps.Sheets = {}
_test_.wraps.Sheets.SSheet = {}
_test_.wraps.Sheets.SSheet.dependencias = {}

_test_.wraps.Sheets.SSheet.dependencias.Cols = {}
_test_.wraps.Sheets.SSheet.dependencias.Cel = {}
_test_.wraps.Sheets.SSheet.dependencias.Linha = {}
_test_.wraps.Sheets.SSheet.dependencias.Sheet = {}




_test_.wraps.Sheets.SSheet.SSheet = ({ssheet_url}) => {

    const g_ssheet = ssheet_url
    ? SpreadsheetApp.openByUrl(ssheet_url)
    : SpreadsheetApp.getActiveSpreadsheet()

    const s_teste_helper = util.wraps.Sheets._Test_helper_({g_ssheet})
    const ssheet = wraps.Sheets.SSheet.SSheet({g_ssheet});
    
    s_teste_helper.deletar_sheets_teste()

    const testes = {

        "SSheet" : () => {
            
            return {
                
                'get_sheet' : () => {

                    return {
                        'gera sheet da aba existente': () => {

                            const cols = ['COLUNA1', 'COLUNA2', 'COLUNA3']            
                            const g_sheet = s_teste_helper.get_nova_sheet_teste({cols})
                            const aba_nome = g_sheet.getSheetName()
                            
                            const s = ssheet.get_sheet({aba_nome})
                            
                            if(s) return true                    
                            return false
                        },

                        'erro ao tentar gerar sheet com aba inexistente': () =>  { 
                            try {
                                ssheet.get_sheet({aba_nome: Utilities.getUuid()})
                                return false
                            }catch(e){
                                return true
                            }
                        },

                        'lida com cols_esperadas da sheet': () => {
                            
                            const cols = ['COLUNA_1', 'COL2', 'COL_3']                            
                            const g_sheet = s_teste_helper.get_nova_sheet_teste({cols})
                            const aba_nome = g_sheet.getName()

                            return {
                                'gera sheet com as colunas corretas': () => {
                                    return {
                                        'pode_extras: true': () => {
                                            ssheet.get_sheet({
                                                aba_nome, 
                                                cols_esperadas: [...cols.slice(0,-1)],
                                                pode_extras: true
                                            })

                                            return true
                                        },

                                        'pode_extras: false': () => {
                                            ssheet.get_sheet({
                                                aba_nome,
                                                cols_esperadas: cols,
                                                pode_extras: false
                                            })

                                            return true
                                        }
                                    }
                                },

                                'erro gerar sheet com colunas erradas': () => {
                                    return {
                                        'pode_extras: true': () => {
                                            try{
                                                ssheet.get_sheet({
                                                    aba_nome,
                                                    cols_esperadas: [...cols, 'COL_EXTRA_FALTANTE_NA_SHEET'],
                                                    pode_extras: true
                                                })
                                            }catch(e){
                                                return true
                                            }
                                            return false
                                        },

                                        'pode_extras: false': () => {
                                            try{
                                                ssheet.get_sheet({
                                                    aba_nome,
                                                    cols_esperadas: [...cols.slice(0, -1)],
                                                    pode_extras: false
                                                })
                                            }catch(e){
                                                return true
                                            }
                                            return false
                                        }
                                    }
                                }
                            }
                        }
                    }    
                },

                'get_nova_sheet': () => {

                    return {
                        'cria nova aba': () => {
                            const nova_aba_nome = s_teste_helper.get_aba_nome_teste() 
                            
                            ssheet.get_nova_sheet({
                                aba_nome: nova_aba_nome
                            })
                            
                            if(g_ssheet.getSheetByName(nova_aba_nome)) return true
                            return false
                        },

                        'cria nova aba com as colunas passadas': () => {
                            
                        }
                    }
                }
                
            }
        }


    }

    util._testar_({ teste_obj: testes })

}

