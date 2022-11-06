import { Item } from "./item";

export class User implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public email?: string,
    public username?: string,
    public roles?: any,
    public password?: string,
    public userIdentifier?: string
  ) {
    this["@id"] = _id;
  }
}
