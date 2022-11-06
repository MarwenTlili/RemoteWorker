import { Item } from "./item";

export class Client implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public address?: string,
    public presentation?: string,
    public country?: string,
    public city?: string,
    public phone?: string,
    public userRef?: string,
    public missions?: string[]
  ) {
    this["@id"] = _id;
  }
}
