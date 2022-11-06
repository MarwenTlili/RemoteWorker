import { Item } from "./item";

export class Quote implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public proposedPrice?: string,
    public numberOfDays?: number,
    public startAt?: Date,
    public date?: Date,
    public confirmed?: boolean,
    public engineer?: string,
    public mission?: string
  ) {
    this["@id"] = _id;
  }
}
