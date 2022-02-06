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
    document.addEventListener('click', this.onClick, false);
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
    let n = 0;
    formats.map((def) => {
      var id = "item" + n;
      var e = this.createListElement(id, def.label);
      listParent.appendChild(e);
      n++;
    });
  }

  async onClick(ev: Event) {
    const w = await chrome.windows.getCurrent({
      populate: true,
      windowTypes: ["normal"],
    });
    const tab = w.tabs.find(t => t.active)
    if (ev.target === null) {
      throw new Error("target is null")
    }
    const target = (ev.target as unknown) as ContextMenuItem
    var formatIndex = parseInt(target.id.slice(-1));
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
