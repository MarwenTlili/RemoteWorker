import { UserCreate } from "./UserCreate";
import { UserEdit } from "./UserEdit";
import UserList from "./UserList";
import { UserShow } from "./UserShow";

const resource = {
  list: UserList,
  create: UserCreate,
  edit: UserEdit,
  show: UserShow
}

export default resource;
