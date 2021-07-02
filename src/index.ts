"use strict";

class WebExtRatingModal {
  // Frontend modal features
  _headline = "";
  _text = "";
  _logo = "";

  // Document Object
  private _document: Document;

  // Timeout until modal is shown - in ms
  private _timeout = 0;

  // Date and Time of Installation
  private _installDate: Date;

  // Chrome Web Store Link
  private _chromeLink = "";

  // FF Addon Store Link
  private _ffLink = "";
  private _window: Window;

  constructor(
    window: Window,
    headline: string,
    text: string,
    installDate: Date,
    ffLink?: string,
    chromeLink?: string,
    logo?: string,
    timeout?: number
  ) {
    this._document = window.document;
    this._window = window;

    this._headline = headline;
    this._text = text;
    this._logo = logo || "";

    this._timeout = timeout || 0;
    this._installDate = new Date(installDate) || Date.now();

    this._chromeLink = chromeLink || "";
    this._ffLink = ffLink || "";

    // if(isShowtime) then
    this.addModalToDocument();
  }

  public get timeout(): number {
    return this._timeout;
  }
  public set timeout(value) {
    this._timeout = value;
  }

  public get window(): Window {
    return this._window;
  }
  public set window(value: Window) {
    this._window = value;
  }

  public get installDate(): Date {
    return this._installDate;
  }
  public set installDate(value) {
    this._installDate = value;
  }

  public get chromeLink(): string {
    return this._chromeLink;
  }
  public set chromeLink(value) {
    this._chromeLink = value;
  }

  public get ffLink(): string {
    return this._ffLink;
  }
  public set ffLink(value) {
    this._ffLink = value;
  }

  // Set Modal CSS styling
  public setStyle = (styleRules: string): string => {
    return styleRules;
  };

  public createElement(tagName: string): HTMLElement {
    return this._document.createElement(tagName);
  }
  // Add Modal to Document
  // document.body.appendChild(document.createElement('div'))
  public addModalToDocument = (): void => {
    const blurEl: HTMLElement = this.createElement("div");
    const modalEl: HTMLElement = this.createElement("div");
    const headline: HTMLElement = this.createElement("h3");
    const subtext: HTMLElement = this.createElement("span");

    const button = this.addButton("Test 1234", "https://www.google.de");

    headline.classList.add("fbm-headline");
    headline.innerHTML = this._headline;

    subtext.classList.add("fbm-text");
    subtext.innerHTML = this._text;

    modalEl.classList.add("fbm-modal");
    modalEl.appendChild(headline);
    modalEl.appendChild(subtext);
    modalEl.appendChild(button);

    // Do not close the Modal when clicked on the child element
    modalEl.addEventListener("click", (ev) => {
      ev.stopPropagation();
    });

    blurEl.classList.add("fbm-blur");
    blurEl.appendChild(modalEl);

    // Close the Modal when clicked anywhere outside the modal (aka the blur element)
    blurEl.addEventListener("click", () =>
      this._document.body.removeChild(blurEl)
    );

    // Append the modal to the document body.
    this._document.body.appendChild(blurEl);
  };

  // Returns an HTMLElement Button representation with a redirect after
  public addButton = (btnHtml: string, link: string): HTMLElement => {
    const button: HTMLElement = this.createElement("button");
    button.classList.add("fbm-button");
    button.innerHTML = btnHtml;
    button.addEventListener("click", () => this.redirectTo(link));

    return button;
  };

  // Open a new tab after clicking the button
  public redirectTo = (link: string): void => {
    this._window.open(link, "_blank");
    //this._window.location.assign(link);
  };

  // Is it time to show the modal yet? (true/false)
  public isShowtime = (): boolean => {
    const now = new Date(Date.now());
    const timePassed = now.getTime() - this._installDate.getTime();

    if (timePassed > this._timeout) {
      return true;
    } else {
      return false;
    }
  };
}

export default WebExtRatingModal;
