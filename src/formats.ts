export interface FormatDefinition {
  label: string
  format: string
}

export class Format {
  formats: FormatDefinition[]

  constructor() {
      this.formats = [
        { label: "Readable Url", format: '%decoded_url%' },
        { label: "Encoded Url", format: '%url%' },
        { label: "Scrapbox", format: '[%text% %decoded_url%]' },
        { label: "Markdown", format: '[%text_md%](%url%)' },
    ]
  }

  getFormats(): FormatDefinition[] {
    return this.formats
  }
  format(index: number): FormatDefinition {
    return this.formats[index]
  }
}

const fmt = new Format()
export default fmt
