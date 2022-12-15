import { useParams } from 'react-router-dom';
import {
  useGetOne,
  useRedirect,
  Loading,
  EditButton,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  DeleteWithConfirmButton,
  useRecordContext
} from 'react-admin';
import {
  Typography,
  useMediaQuery
} from '@mui/material';

const CustomToolbar = () => {
  const record = useRecordContext();
  // the record can be empty while loading
  if (!record) return null;
  return (
    <TopToolbar>
      <EditButton label='Edit' />
      <DeleteWithConfirmButton
        label='Delete'
        confirmTitle={"Delete User '" + record.username + "'"}
        confirmContent="After delete the user, it cannot be recovered. Are you sure?"
        translateOptions={{ name: record.username }}
      />
    </TopToolbar>
  )
}

export const UserShow = () => {
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const { id } = useParams();
  const redirect = useRedirect();
  const { data, isLoading } = useGetOne(
    'users',
    { id },
    { onError: () => redirect('/users') }
  );

  if (isLoading) { return <Loading />; }

  return(
    <Show actions={<CustomToolbar />} title={data.username}>
      <SimpleShowLayout>
        <TextField source="username" />
        <TextField source="email" />

        <div>
          <Typography variant='caption' display='block'>Roles</Typography>
          {data.roles.map((role: any) => {
            switch (role) {
              case "ROLE_ADMIN":
                return <Typography key={role} variant='body2' color="red" >admin </Typography>;
              case "ROLE_CLIENT":
                return <Typography key={role} variant='body2' color="blue">client </Typography>;
              case "ROLE_ENGINEER":
                return <Typography key={role} variant='body2' color="orange">engineer </Typography>;
              default:
                return <Typography key={0} variant='body2' color="error">UNDEFINED </Typography>;
            }
          })}
        </div>

        <TextField source="password" />
      </SimpleShowLayout>
    </Show>

  );
}


