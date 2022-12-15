import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  AutocompleteArrayInput,
  useRecordContext,
  DeleteWithConfirmButton,
  SaveButton,
  Toolbar
} from 'react-admin';

const CustomToolbar = () => {
  const record = useRecordContext();
  // the record can be empty while loading
  if (!record) return null;
  return (
    <Toolbar>
      <SaveButton label="save" />
      <DeleteWithConfirmButton
        label="Delete"
            confirmTitle={"Delete User '" + record.username + "'"}
          confirmContent="After delete the user, it cannot be recovered. Are you sure?"
          translateOptions={{ name: record.username }}
      />
    </Toolbar>
  )
}

export const UserEdit = () => {
  return (
    <Edit >
      <SimpleForm toolbar={<CustomToolbar />} >
        {/* <TextInput disabled label="Id" source="id" /> */}
        <TextInput source="username" validate={required()} />
        <TextInput source="email" validate={required()} />
        <AutocompleteArrayInput source="roles"
          choices={[
            { id: 'ROLE_ADMIN', name: 'admin' },
            { id: 'ROLE_ENGINEER', name: 'engineer' },
            { id: 'ROLE_CLIENT', name: 'client' },
          ]}
        >
        </AutocompleteArrayInput>
        <TextInput source="password" validate={required()} />
      </SimpleForm>
    </Edit>
  );
}

