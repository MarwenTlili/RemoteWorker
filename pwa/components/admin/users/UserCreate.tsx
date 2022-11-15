import {
  AutocompleteArrayInput,
  Create,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";

export const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" defaultValue="engineer3@example.com"/>
      <TextInput source="username" defaultValue="engineer3"/>
      <TextField />
      {/* <InputGuesser source="roles" /> */}
      <AutocompleteArrayInput
        source="roles"
        choices={[
          { id: 'ROLE_ADMIN', name: 'admin' },
          { id: 'ROLE_ENGINEER', name: 'engineer' },
          { id: 'ROLE_CLIENT', name: 'client' },
        ]}
      >
      </AutocompleteArrayInput>
      {/* <ArrayInput  {...props}>
        <SimpleFormIterator>
          <TextInput source="roles"/>
        </SimpleFormIterator>
      </ArrayInput> */}
      <TextInput source="password" defaultValue="engineer3"/>
    </SimpleForm>
  </Create>
)
