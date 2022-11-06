import { Item } from "./item";

export class Mission implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public description?: string,
    public budget?: string,
    public startDate?: Date,
    public endDate?: Date,
    public affected?: boolean,
    public client?: string,
    public subDomains?: string[],
    public quotes?: string[]
  ) {
    this["@id"] = _id;
  }
}
