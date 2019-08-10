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
var textObjectLength = 0;
function extractTexts(nodeObjectsArray) {
    let texts = '';
    for (let i = 0; i < nodeObjectsArray.length; i++) {
        if (nodeObjectsArray[i].type == 'TEXT') {
            if (textObjectLength > 0) {
                texts += '\n';
            }
            texts += nodeObjectsArray[i].characters;
            textObjectLength++;
        }
        else if (nodeObjectsArray[i].type == 'GROUP' || nodeObjectsArray[i].type == 'FRAME' || nodeObjectsArray[i].type == 'COMPONENT' || nodeObjectsArray[i].type == 'INSTANCE') {
            texts += extractTexts(nodeObjectsArray[i].children);
        }
    }
    return texts;
}
function pasteFunction(nodeObjectsArray, copiedText) {
    for (let i = 0; i < nodeObjectsArray.length; i++) {
        if (nodeObjectsArray[i].type == 'TEXT') {
            loadFont(nodeObjectsArray[i], copiedText);
        }
        else if (nodeObjectsArray[i].type == 'GROUP' || nodeObjectsArray[i].type == 'FRAME' || nodeObjectsArray[i].type == 'COMPONENT' || nodeObjectsArray[i].type == 'INSTANCE') {
            pasteFunction(nodeObjectsArray[i].children, copiedText);
        }
    }
}
function loadFont(selectedItem, pasteValue) {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync({ family: selectedItem.fontName.family, style: selectedItem.fontName.style });
        selectedItem.characters = pasteValue;
    });
}
function main() {
    if (figma.command == 'copyText') {
        let selectedItems = figma.currentPage.selection;
        let copiedText = extractTexts(selectedItems);
        figma.ui.postMessage({ copiedText });
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
                pasteFunction(selectedItems, message.pasteTextValue);
                figma.closePlugin();
            }
        };
    }
}
main();
