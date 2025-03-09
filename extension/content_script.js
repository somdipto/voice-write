browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.command === "insertText") {
            insertTextAtCursor(request.text);
        }
    }
);

function insertTextAtCursor(text) {
    const activeElement = document.activeElement;

    if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        if (tagName === 'textarea' || tagName === 'input') {
            // For textareas and input fields
            const startPos = activeElement.selectionStart;
            const endPos = activeElement.selectionEnd;
            const oldValue = activeElement.value;
            activeElement.value = oldValue.substring(0, startPos) + text + oldValue.substring(endPos, oldValue.length);

            // Update cursor position to be after inserted text
            activeElement.selectionStart = activeElement.selectionEnd = startPos + text.length;
        } else if (activeElement.isContentEditable) {
            // For contenteditable elements (like in some rich text editors)
            const selection = window.getSelection();
            if (selection.rangeCount) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        } else {
            // For other elements, attempt to focus and then insert (may not always work)
            activeElement.focus();
            document.execCommand('insertText', false, text);
        }
    }
}
