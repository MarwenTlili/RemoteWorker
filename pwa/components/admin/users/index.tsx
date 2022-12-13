import { EditGuesser } from "@api-platform/admin";
import { UserCreate } from "./UserCreate";
import UserList from "./UserList";
import { UserShow } from "./UserShow";

const resource = {
  list: UserList,
  create: UserCreate,
  edit: EditGuesser,
  show: UserShow
}

export default resource;
