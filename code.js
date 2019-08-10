var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__);
figma.ui.hide();
if (figma.command == 'copyText') {
    let selectedItems;
    let texts = '';
    var textObjectLength = 0;
    selectedItems = figma.currentPage.selection;
    for (let i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].type == 'TEXT') {
            if (textObjectLength > 0) {
                texts += '\n';
            }
            texts += selectedItems[i].characters;
        }
        textObjectLength++;
    }
    figma.ui.postMessage({ texts });
    figma.ui.onmessage = message => {
        if (message.quit) {
            figma.closePlugin();
        }
    };
}
if (figma.command == 'pasteText') {
    var selectedItems = figma.currentPage.selection;
    var textObjectLength = 0;
    figma.ui.postMessage({ paste: true });
    figma.ui.onmessage = message => {
        if (message.pasteTextValue) {
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i].type == 'TEXT') {
                    loadFont(selectedItems[i], message.pasteTextValue);
                }
            }
        }
    };
}
function loadFont(selectedItem, pasteValue) {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync({ family: selectedItem.fontName.family, style: selectedItem.fontName.style });
        selectedItem.characters = pasteValue;
        figma.closePlugin();
    });
}
