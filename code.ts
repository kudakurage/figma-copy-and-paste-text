figma.showUI(__html__);
figma.ui.hide();
var textObjectLength = 0;

function extractTexts(nodeObjectsArray){
  let texts = '';
  for (let i = 0; i < nodeObjectsArray.length; i++) {
    if(nodeObjectsArray[i].type == 'TEXT'){
      if (textObjectLength > 0){
        texts += '\n';
      }
      texts += nodeObjectsArray[i].characters;
      textObjectLength++;
    } else if (nodeObjectsArray[i].type == 'GROUP' || nodeObjectsArray[i].type == 'FRAME' || nodeObjectsArray[i].type == 'COMPONENT' || nodeObjectsArray[i].type == 'INSTANCE'){
      texts += extractTexts(nodeObjectsArray[i].children);
    }
  }
  return texts;
}

function pasteFunction(nodeObjectsArray, copiedText){
  for (let i = 0; i < nodeObjectsArray.length; i++) {
    if(nodeObjectsArray[i].type == 'TEXT'){
      loadFont(nodeObjectsArray[i], copiedText);
    } else if (nodeObjectsArray[i].type == 'GROUP' || nodeObjectsArray[i].type == 'FRAME' || nodeObjectsArray[i].type == 'COMPONENT' || nodeObjectsArray[i].type == 'INSTANCE'){
      pasteFunction(nodeObjectsArray[i].children, copiedText);
    }
  }
}

async function loadFont(selectedItem, pasteValue) {
  let selectedItemFontName = selectedItem.getRangeFontName(0, 1);
  await figma.loadFontAsync({ family: selectedItemFontName.family, style: selectedItemFontName.style });
  if(selectedItem.fontName == figma.mixed){
    selectedItem.setRangeFontName(0, selectedItem.characters.length, selectedItemFontName);
  }
  selectedItem.setRangeFontSize(0, selectedItem.characters.length, selectedItem.getRangeFontSize(0, 1));
  selectedItem.setRangeTextCase(0, selectedItem.characters.length, selectedItem.getRangeTextCase(0, 1));
  selectedItem.setRangeTextDecoration(0, selectedItem.characters.length, selectedItem.getRangeTextDecoration(0, 1));
  selectedItem.setRangeLetterSpacing(0, selectedItem.characters.length, selectedItem.getRangeLetterSpacing(0, 1));
  selectedItem.setRangeLineHeight(0, selectedItem.characters.length, selectedItem.getRangeLineHeight(0, 1));
  selectedItem.setRangeFills(0, selectedItem.characters.length, selectedItem.getRangeFills(0, 1));
  selectedItem.setRangeTextStyleId(0, selectedItem.characters.length, selectedItem.getRangeTextStyleId(0, 1));
  selectedItem.setRangeFillStyleId(0, selectedItem.characters.length, selectedItem.getRangeFillStyleId(0, 1));
  selectedItem.characters = pasteValue;
}

function main(){
  if (figma.command == 'copyText'){
    let selectedItems = figma.currentPage.selection;
    let copiedText = extractTexts(selectedItems);
    figma.ui.postMessage({ copiedText });
  }

  if (figma.command == 'pasteText'){
    figma.ui.postMessage({ paste : true });
  }

  figma.ui.onmessage = message => {
    if (message.quit) {
      figma.closePlugin();
    }
    if(message.pasteTextValue){
      pasteFunction(figma.currentPage.selection, message.pasteTextValue);
      figma.closePlugin();
    }
  }
}

main();