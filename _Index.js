


function onOpen(){

    const ui = SpreadsheetApp.getUi()
    let menu = ui.createMenu('🕷 Processar Extratos')

    menu = addSubMenu_COMPARAR_CORRESPS({ui, menu})

    menu.addToUi()
}

