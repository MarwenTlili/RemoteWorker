import { useParams } from 'react-router-dom';
import { useGetOne, useRedirect, Title, Loading } from 'react-admin';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Container,
  Box
} from '@mui/material';

export const UserShow = () => {
  const { id } = useParams();
  const redirect = useRedirect();
  const { data, isLoading } = useGetOne(
    'users',
    { id },
    { onError: () => redirect('/users') }
  );

  if (isLoading) { return <Loading />; }

  return(
    <div>
      <Title title="User Show" />

      <Box component="span" sx={{ p: 4, border: 'none' }}>
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <Stack spacing={2} >
                <div>
                  <Typography variant="caption" display="block">Username</Typography>
                  <Typography variant="h5">{data.username}</Typography>
                </div>
                <div>
                  <Typography variant="caption" display="block">E-Mail</Typography>
                  <Typography variant="h5">{data.email}</Typography>
                </div>
                <div>
                  <Typography variant='caption' display='block'>Roles</Typography>
                  {data.roles.map((role: any) => {
                    switch (role) {
                      case "ROLE_ADMIN":
                        return <Typography key={role} variant='h5' color="red" >admin </Typography>;
                      case "ROLE_CLIENT":
                        return <Typography key={role} variant='h5' color="blue">client </Typography>;
                      case "ROLE_ENGINEER":
                        return <Typography key={role} variant='h5' color="orange">engineer </Typography>;
                      default:
                        return <Typography key={0} variant='h5' color="error">UNDEFINED </Typography>;
                    }
                  })}
                </div>
                <div>
                  <Typography variant='caption' display='block'>Encrypted Password</Typography>
                  <Typography variant='body2'>{ data.password }</Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>

    </div>
  );
}

