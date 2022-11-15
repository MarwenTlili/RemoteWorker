import {
  Datagrid,
  List as RaList,
  Pagination,
  SimpleListLoading,
  TextField,
  useGetIdentity,
  useGetList,
  useListContext,
  useNotify,
  useRedirect
} from "react-admin";
import { User } from "../types";
import {
  List,
} from '@mui/material';

const UserListContent = () => {
  const {
    data: users,
    isLoading,
  } = useListContext<User>();
  if (isLoading) {
    return <SimpleListLoading hasLeftAvatarOrIcon hasSecondaryText />;
  }
  const now = Date.now();

  return(
    <>
      <List >
        <Datagrid>
          <TextField source="username" />
          <TextField source="email" />
          <TextField source="roles" />
        </Datagrid>
      </List>
    </>
  )
}

export const UserList = () => {
  const { identity } = useGetIdentity();
  const { data, total, isLoading } = useGetList('api/users', {
    // filter: { q: filter },
    // pagination: { page, perPage },
    // sort,
  });

  const notify = useNotify();
  const redirect = useRedirect();
  const onError = (error: any) => {
    notify(`Could not load list: ${error.message}`, { type: 'warning' });
    redirect('/admin');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return identity ? (
    <RaList
      perPage={10}
      pagination={ <Pagination  /> }
      // sort={{ field: 'username', order: 'DESC' }}
    >
      <UserListContent />
    </RaList>
  ): null
}

