figma.showUI(__html__)
figma.ui.hide()

const defaultFontSize = 16
const defaultFontName = { family: 'Roboto', style: 'Regular' }
var textObjectLength = 0

function extractTexts(nodeObjectsArray){
  let texts = ''
  for (let i = 0; i < nodeObjectsArray.length; i++) {
    if(nodeObjectsArray[i].type == 'TEXT'){
      if (textObjectLength > 0){
        texts += '\n'
      }
      texts += nodeObjectsArray[i].characters
      textObjectLength++
    } else if (nodeObjectsArray[i].type == 'GROUP' || nodeObjectsArray[i].type == 'FRAME' || nodeObjectsArray[i].type == 'COMPONENT' || nodeObjectsArray[i].type == 'INSTANCE'){
      texts += extractTexts(nodeObjectsArray[i].children)
    }
  }
  return texts
}

function pasteFunction(nodeObjectsArray, copiedText){
  if (nodeObjectsArray.length){
    for (let i = 0; i < nodeObjectsArray.length; i++) {
      if(nodeObjectsArray[i].type == 'TEXT'){
        updateText(nodeObjectsArray[i], copiedText)
        textObjectLength++
      } else if (nodeObjectsArray[i].type == 'GROUP' || nodeObjectsArray[i].type == 'FRAME' || nodeObjectsArray[i].type == 'COMPONENT' || nodeObjectsArray[i].type == 'INSTANCE'){
        pasteFunction(nodeObjectsArray[i].children, copiedText)
      }
    }
    if (textObjectLength == 0){
      createNewText(copiedText, nodeObjectsArray[0])
      textObjectLength++
    }
  }else{
    createNewText(copiedText, null)
    textObjectLength++
  }
  return textObjectLength
}

async function createNewText(characters, nodeObject) {
  await figma.loadFontAsync({ family: defaultFontName.family, style: defaultFontName.style })
  const newTextNode = figma.createText()
  newTextNode.fontSize = defaultFontSize
  newTextNode.fontName = defaultFontName
  newTextNode.characters = characters
  if(nodeObject){
    newTextNode.x = nodeObject.x + (nodeObject.width / 2) - (newTextNode.width / 2)
    newTextNode.y = nodeObject.y + (nodeObject.height / 2) - (newTextNode.height / 2)
  }else{
    newTextNode.x = figma.viewport.center.x - (newTextNode.width / 2)
    newTextNode.y = figma.viewport.center.y - (newTextNode.height / 2)
  }
  figma.currentPage.appendChild(newTextNode)
  figma.currentPage.selection = [newTextNode]
  return newTextNode;
}

async function updateText(selectedItem, pasteValue) {
  let selectedItemFontName = selectedItem.getRangeFontName(0, 1)
  await figma.loadFontAsync({ family: selectedItemFontName.family, style: selectedItemFontName.style })
  if(selectedItem.fontName == figma.mixed){
    selectedItem.setRangeFontName(0, selectedItem.characters.length, selectedItemFontName)
  }
  selectedItem.setRangeFontSize(0, selectedItem.characters.length, selectedItem.getRangeFontSize(0, 1))
  selectedItem.setRangeTextCase(0, selectedItem.characters.length, selectedItem.getRangeTextCase(0, 1))
  selectedItem.setRangeTextDecoration(0, selectedItem.characters.length, selectedItem.getRangeTextDecoration(0, 1))
  selectedItem.setRangeLetterSpacing(0, selectedItem.characters.length, selectedItem.getRangeLetterSpacing(0, 1))
  selectedItem.setRangeLineHeight(0, selectedItem.characters.length, selectedItem.getRangeLineHeight(0, 1))
  selectedItem.setRangeFills(0, selectedItem.characters.length, selectedItem.getRangeFills(0, 1))
  selectedItem.setRangeTextStyleId(0, selectedItem.characters.length, selectedItem.getRangeTextStyleId(0, 1))
  selectedItem.setRangeFillStyleId(0, selectedItem.characters.length, selectedItem.getRangeFillStyleId(0, 1))
  selectedItem.characters = pasteValue
}

function main(){
  if (figma.command == 'copyText'){
    let selectedItems = figma.currentPage.selection
    if (selectedItems.length == 0){
      return figma.closePlugin('No object selected.')
    }
    let copiedText = extractTexts(selectedItems)
    if (copiedText){
      figma.ui.postMessage({ copiedText })
    } else {
      return figma.closePlugin('No text object selected.')
    }
  }

  if (figma.command == 'pasteText'){
    figma.ui.postMessage({ paste : true })
  }

  figma.ui.onmessage = message => {
    if (message.quit) {
      figma.closePlugin('Copied: ' + message.text)
    }
    if(message.pasteTextValue == null){
      figma.closePlugin('No text to paste.')
    }else{
      let num = pasteFunction(figma.currentPage.selection, message.pasteTextValue)
      figma.closePlugin('Pasted text to ' + num + ' object' + ((num > 1) ? 's':''))
    }
  }
}

main()