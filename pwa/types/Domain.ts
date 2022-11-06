import { Item } from "./item";

export class Domain implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public subDomains?: string[]
  ) {
    this["@id"] = _id;
  }
}
