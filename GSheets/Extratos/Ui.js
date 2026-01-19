//@ts-check
'🗂'
/**
 *  @param {{
 * menu: GoogleAppsScript.Base.Menu
 * ui: GoogleAppsScript.Base.Ui
 * }} params 
 * */
function addSubMenu_COMPARAR_CORRESPS({ui, menu}){

    const sub_menu = ui.createMenu('🟰 Comparar correspondentes')

    sub_menu
    .addItem('⬛️"_Extrato"', 'item_func_COMPARAR_CORRESPS_extrato')

    sub_menu
    .addItem('🟩"Geral"', 'item_func_COMPARAR_CORRESPS_geral')

    menu.addSubMenu(sub_menu)

    return menu
}



function item_func_COMPARAR_CORRESPS_extrato(){
    handle_COMPARAR_CORRESPS({aba: '_Extrato'})
}

function item_func_COMPARAR_CORRESPS_geral(){
    handle_COMPARAR_CORRESPS({aba: 'Geral'})
}


function handle_COMPARAR_CORRESPS({aba}){

    const sheet_alvo = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(aba)
    
    const sheet_corresp = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('_Correspondente')

    const ui = SpreadsheetApp.getUi()
    
    try{
        // @ts-ignore
        COMPARAR_CORRESPS({sheet_alvo, sheet_corresp})
        ui.alert('Sucesso ao comparar planilhas')

    }catch(e){
        ui.alert('Erro', e.message, ui.ButtonSet.OK)
    }
}




