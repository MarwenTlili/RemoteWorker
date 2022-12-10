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
      <TextInput source="email" defaultValue=""/>
      <TextInput source="username" defaultValue=""/>
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
      <TextInput source="password" defaultValue=""/>
    </SimpleForm>
  </Create>
)
