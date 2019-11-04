# Figma Plugin - Copy and Paste Text(s)
Figma plugin to copy &amp; paste plain text from selected layers.

# Usage
## Copy Text
Select the Text Objects you want to copy and run `Copy Text`.
And then copied texts to clipboard.
(Not support selected range of text)

## Paste Text
Select the Text Objects you want to paste and run `Paste Text`
If you want to paste in cursor position, you should run default paste (⌘V) with unformmated text (you will get it with `Copy Text` plugin command !!).

# Demo
## Copy and Paste
![Copy and Paste](images/demo-copy_and_paste.gif)

## Copy multi selected texts and Paste
![Copy and Paste](images/demo-copy_multi_texts_and_paste.gif)

## Copy and Paste to group texts
![Copy and Paste](images/demo-copy_and_group_texts.gif)

# Recommend Shortcut Settings (for Mac)
I recommend setting shortcuts key for plugin commands.

![shortcut guide 1](images/shortcut_guide1.png)

- Launch SystemPreferences, and move to Keyboard -> Shortcuts -> App Shortcuts.
- Click [+] button to add new shortcut

![shortcut guide 1](images/shortcut_guide2.png)

- For `Copy Text`
    - Application: Figma.app
    - Menu Title: Plugins->Copy and Paste Text->Copy Text
    - Keyboard Shortcut: ⌥⇧⌘C (Option + Shift + Command + C)
- For `Paste Text`
    - Application: Figma.app
    - Menu Title: Plugins->Copy and Paste Text->Paste Text
    - Keyboard Shortcut: ⌥⇧⌘C (Option + Shift + Command + V)


# Supported Object
- Text
- Group
- Frame
- Component
- Instance
