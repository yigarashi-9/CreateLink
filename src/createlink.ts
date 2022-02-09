import fmt, { FormatDefinition } from './formats'

interface ClickContext {
  selectionText?: string
  pageUrl: string
  linkUrl?: string
  srcUrl?: string
  mediaType?: string
}


export class CreateLink {
  constructor() {
  }

  formatLinkText(def: FormatDefinition, url: string, text: string, title: string): string {
    text = text || ''

    return def.format.
      replace(/%url%/g, url).
      replace(/%decoded_url%/g, decodeURI(url)).
      replace(/%text%/g, text.replace(/\n/g, ' ')).
      replace(/%text_n%/g, text).
      replace(/%text_br%/g, text.replace(/\n/g, '<br />\n')).
      replace(/%text_md%/g, text.replace(/[|\\`*_{}\[\]()#+\-.!]/g, '\\$&')).
      replace(/%title%/g, title).
      replace(/%newline%/g, '\n').
      replace(/%htmlEscapedText%/g, escapeHTML(text)).
      replace(/\\t/g, '\t').
      replace(/\\n/g, '\n').
      replace(/\\r/g, '\r');
  }

  async formatInTab(def: FormatDefinition, info: ClickContext, tab: chrome.tabs.Tab): Promise<string> {
    var url;
    if (info.mediaType === 'image') {
      url = info.srcUrl;
    } else {
      url = info.linkUrl || info.pageUrl || tab.url;
    }
    var text = info.selectionText || tab.title;
    var title = tab.title;
    return this.formatString(tab.id, def, url, text, title)
  }

  async formatString(tabId: number, def: FormatDefinition, url: string, text: string, title: string): Promise<string> {
    return this.formatLinkText(def, url, text, title)
  }

  indexOfFormatByLabel(label: string): number {
    const formats = fmt.getFormats();
    for (var i = 0, len = formats.length; i < len; i++) {
      var item = formats[i];
      if (item.label === label) {
        return i;
      }
    }
    // use plain text as default format.
    return 1;
  };
}

function escapeHTML(text: string): string {
  return text ? text.replace(/[&<>'"]/g, convertHTMLChar) : text;
}
function convertHTMLChar(c: string): string { return charMap[c]; }
const charMap: { [name: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&apos;',
  '"': '&quot;'
};
