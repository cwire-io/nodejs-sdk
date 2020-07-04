export class CWire {
  private apiKey: string;
  private cwireAPI: string = "https://api.cwire.io/";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public static init(apiKey: string): CWire {
    return new CWire(apiKey);
  }
}
