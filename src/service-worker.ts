
import { Message } from './utils'
import { ContextMenuHandler } from './context-menu-handler'

chrome.runtime.onMessage.addListener(function (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  console.log({ message })
  switch (message.type) {
    case 'updateFormats':
      ContextMenuHandler.updateContextMenus()
      break
  }
})


chrome.contextMenus.onClicked.addListener( async function(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) {
  ContextMenuHandler.onMenuItemClicked(info, tab)
})

chrome.runtime.onInstalled.addListener(async function () {
  ContextMenuHandler.updateContextMenus()
})
