import { Item } from "./item";

export class Engineer implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public firstName?: string,
    public lastName?: string,
    public experience?: number,
    public dayRate?: number,
    public presentation?: string,
    public country?: string,
    public city?: string,
    public phone?: string,
    public photo?: string,
    public gender?: string,
    public userRef?: string,
    public studies?: string[],
    public certifications?: string[],
    public experiences?: string[],
    public quotes?: string[]
  ) {
    this["@id"] = _id;
  }
}
