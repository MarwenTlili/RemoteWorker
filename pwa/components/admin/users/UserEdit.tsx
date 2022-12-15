import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  AutocompleteArrayInput
} from 'react-admin';

export const UserEdit = () => {
  return (
    <Edit>
      <SimpleForm>
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

