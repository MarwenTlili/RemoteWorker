import { RaRecord } from "react-admin";

export interface User extends RaRecord{
  username: string;
  email: string;
  roles: any,
  password: string
}
