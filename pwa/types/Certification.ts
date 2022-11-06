import { Item } from "./item";

export class Certification implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public companyName?: string,
    public startDate?: Date,
    public endDate?: Date,
    public current?: boolean,
    public engineer?: string
  ) {
    this["@id"] = _id;
  }
}
