figma.showUI(__html__);
figma.ui.hide();

if (figma.command == 'copyText'){
  let selectedItems;
  let texts = '';
  var textObjectLength = 0;

  selectedItems = figma.currentPage.selection;

  for (let i = 0; i < selectedItems.length; i++) {
    if(selectedItems[i].type == 'TEXT'){
      if (textObjectLength > 0){
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
  }
}

if (figma.command == 'pasteText'){
  var selectedItems = figma.currentPage.selection;
  var textObjectLength = 0;
  figma.ui.postMessage({ paste : true });

  figma.ui.onmessage = message => {
    if(message.pasteTextValue){
      for (let i = 0; i < selectedItems.length; i++) {
        if(selectedItems[i].type == 'TEXT'){
          loadFont(selectedItems[i], message.pasteTextValue);
        }
      }
    }
  }
}

async function loadFont(selectedItem, pasteValue) {
  await figma.loadFontAsync({ family: selectedItem.fontName.family, style: selectedItem.fontName.style });
  selectedItem.characters = pasteValue;
  figma.closePlugin();
}