import { EditGuesser, ShowGuesser } from "@api-platform/admin";
import { UserCreate } from "./UserCreate";
import UserList from "./UserList";

const resource = {
  list: UserList,
  create: UserCreate,
  edit: EditGuesser,
  show: ShowGuesser
}

export default resource;
