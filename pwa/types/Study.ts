import { Item } from "./item";

export class Study implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public university?: string,
    public startDate?: Date,
    public endDate?: Date,
    public current?: boolean,
    public engineer?: string
  ) {
    this["@id"] = _id;
  }
}
