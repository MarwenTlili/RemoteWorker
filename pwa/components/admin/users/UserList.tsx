import {
  CreateButton,
  DatagridConfigurable,
  ExportButton,
  FilterButton,
  FilterForm,
  SimpleListLoading,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
  SearchInput,
  SimpleList,
  List,
  SelectColumnsButton,
  EditButton,
  ShowButton,
} from "react-admin";
import { User } from "../types";
import { useMediaQuery } from '@mui/material';

const userFilters = [
  <SearchInput source="q" alwaysOn />,
  <TextInput label="Username" source="username" defaultValue="" />,
  <TextInput label="E-Mail" source="email" defaultValue="" />
]

const ListToolbar = () => {
  const isMedium = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

  return (
    <TopToolbar>
      <FilterForm filters={userFilters} />
      <div>
        <FilterButton filters={userFilters} disableSaveQuery/>
        {isMedium ? (
          <></>
        ) : (
          <SelectColumnsButton />
        )}
        <CreateButton
          variant="contained"
          label="create"
          sx={{ marginLeft: 2 }}
        />
        <ExportButton />
      </div>
    </TopToolbar>
  )
}

const UserListContent = () => {
  const {
    data: users,
    isLoading,
  } = useListContext<User>();
  if (isLoading) {
    return <SimpleListLoading hasLeftAvatarOrIcon hasSecondaryText />;
  }

  return (
    <DatagridConfigurable>
      <TextField source="username"/>
      <TextField source="email"/>
      <TextField source="roles" sortable={false}/>
      <EditButton label="edit" />
      <ShowButton label="show" />
    </DatagridConfigurable>
  )
}

const UserList = () => {
  const isXSmall = useMediaQuery((theme: any) => theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  return (
    <List actions={false} title="List of Users">
      <>
        <ListToolbar />
        {isMedium ? (
          <SimpleList
            primaryText={<TextField source="username" />}
            secondaryText={record => record.email}
            tertiaryText={record => record.roles}
          />
        ) : (
          <UserListContent />
        )}
      </>
    </List>
  )
}

export default UserList;
