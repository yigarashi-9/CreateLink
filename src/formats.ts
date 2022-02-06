
const formatsKey = 'format_preferences';
const defaultFormatKey = 'defaultFormat';

export interface FormatDefinition {
  label: string
  format: string
  filter: string
}

export class Format {
  defaultFormatName: string
  formats: FormatDefinition[]

  async load(): Promise<[string, FormatDefinition[]]> {
    return Promise.all([
      new Promise<string>(resolve => {
        chrome.storage.sync.get(defaultFormatKey, (v) => {
          this.defaultFormatName = (v[defaultFormatKey] || "Plain text")
          resolve(this.defaultFormatName)
        })
      }),
      new Promise<FormatDefinition[]>(resolve => {
        chrome.storage.sync.get(formatsKey, (v) => {
          this.formats = (v[formatsKey] || [
            { label: "Decoded Url", format: '%decoded_url%' },
            { label: "Scrapbox", format: '[%text% %decoded_url%]' },
            { label: "Markdown", format: '[%text_md%](%url%)' },
        ])
          resolve(this.formats)
        })
      })
    ])
  }

  setDefaultFormatName(value: string) {
    this.defaultFormatName = value
    chrome.storage.sync.set({
      [defaultFormatKey]: value
    });
  };

  getDefaultFormatName(): string {
    return this.defaultFormatName
  }

  getDefaultFormat(): FormatDefinition {
    const found = this.formats.find(f => {
      return f.label === this.defaultFormatName
    })
    return found || this.formats[0]
  }
  getFormats(): FormatDefinition[] {
    return this.formats
  }
  format(index: number): FormatDefinition {
    return this.formats[index]
  }

  setFormats(formats: FormatDefinition[]) {
    this.formats = formats
    chrome.storage.sync.set({
      [formatsKey]: formats
    });
  };
}

const fmt = new Format()
export default fmt
