export {}


declare global{

    namespace Extratos{

        namespace At_corresps {
            
            type AT_CORRESPS = (params: {
                sheet_alvo: GoogleAppsScript.Spreadsheet.Sheet,
                sheet_corresp: GoogleAppsScript.Spreadsheet.Sheet
            }) => void
            
        }

    }

}