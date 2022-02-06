import { getCurrentTab } from './utils'
import fmt, { FormatDefinition } from './formats'
import { CreateLink } from './createlink'

interface ContextMenuItem {
  id: string
}

export class PopupHandler {
  initialize() {
    this.initializeMenuItems()
  }

  async initializeMenuItems() {
    document.addEventListener('click', this.onClick.bind(this), false);

    await fmt.load()
    const formats = fmt.getFormats()
    this.setupListItems(formats);
  }

  createListElement(id: string, text: string) {
    var e = document.createElement('li');
    e.setAttribute('class', "item");
    var button = document.createElement('button');
    button.setAttribute('id', id);
    button.innerText = text;
    e.appendChild(button);
    return e;
  }

  setupListItems(formats: FormatDefinition[]) {
    var listParent = document.getElementById("formatlist");
    var insertionPoint = document.getElementById("separator");
    var n = 0;
    formats.map((def) => {
      var id = "item" + n;
      var e = this.createListElement(id, def.label);
      listParent.insertBefore(e, insertionPoint);
      n++;
    });
  }

  onClick(ev: Event) {
    getCurrentTab().then((tab: chrome.tabs.Tab) => {
      if (ev.target === null) {
        throw new Error("target is null")
      }
      const target = (ev.target as unknown) as ContextMenuItem
      this.onMenuSelected(tab, target.id);
    })
  }

  async onMenuSelected(tab: chrome.tabs.Tab, id: string) {
    if (id == 'configure') {
      chrome.tabs.create({ url: "options.html" });
      window.close();
    } else if (id == 'separator') {
    } else if (id.match(/^item(\d+)$/)) {
      var formatIndex = Number(RegExp.$1);

      const def = fmt.format(formatIndex)
      const cl = new CreateLink()
      const link = await cl.formatInTab(def, {
        selectionText: '',
        pageUrl: tab.url,
      }, tab)
      await navigator.clipboard.writeText(link);
      window.close();
    }
  }
}
