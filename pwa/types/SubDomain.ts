import { Item } from "./item";

export class SubDomain implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public domain?: string,
    public missionSubdomain?: string[]
  ) {
    this["@id"] = _id;
  }
}
