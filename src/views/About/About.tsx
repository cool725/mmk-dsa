import { useCallback } from 'react';
import { Card, CardActions, CardContent, CardHeader, Divider, Grid, Link, Typography } from '@material-ui/core';
import { AppButton, AppLink, AppIconButton } from '../../components';
// import UserInfo from '../../components/UserInfo/UserInfo';
import api from '../../api';
// import { IUserInfo } from '../../api/types';

/**
 * Renders "About" view
 * url: /about/*
 */
const AboutView = () => {
  // const [user, setUser] = useState<Partial<IUserInfo>>({});

  const handleServerInfoClick = useCallback(async () => {
    const serverInfo = await api.info.server();
    console.log('Server Info:', serverInfo);

    const directusInfo = await api.info.directus();
    console.log('Directus Info:', directusInfo);

    const message = `Server Info
name: ${serverInfo?.project?.project_name}
logo: ${serverInfo?.project?.project_logo || 'not set'}
note: ${serverInfo?.project?.public_note || 'not set'}
url: ${api?.url}
    `;
    alert(message);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="DSA Web App" subheader="Version 0.8" />
          <CardContent>
            Public web application for DSA (Direct Selling Agent). This is part of MMK LAP product (Loan Against
            Property).
          </CardContent>
          <CardActions>
            <AppLink to="/">
              <AppButton color="primary">OK</AppButton>
            </AppLink>
            <AppButton color="secondary" onClick={handleServerInfoClick}>
              Server Info
            </AppButton>
          </CardActions>
        </Card>
      </Grid>

      {/* <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Current User" />
          <CardContent>
            <UserInfo user={user} />
          </CardContent>
          <CardActions>
            <AppButton
              onClick={async () => {
                await api.auth.loginWithEmail({ email: 'agent@test.com', password: 'Test12345' });
                setUser((await api.info.me()) as IUserInfo);
              }}
            >
              Load Test Agent
            </AppButton>
          </CardActions>
        </Card>
      </Grid> */}

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="AppLink" />
          <CardContent>
            <Link color="initial">MUI initial</Link> <Link color="inherit">MUI inherit</Link>{' '}
            <Link color="primary">MUI primary</Link> <Link color="secondary">MUI secondary</Link>{' '}
            <Link color="textPrimary">MUI textPrimary</Link> <Link color="textSecondary">MUI textSecondary</Link>{' '}
            <Link color="error">MUI error</Link> <br />
            <AppLink to="/">Internal Link</AppLink> &nbsp;
            <AppLink to="/" openInNewTab>
              Internal Link in New Tab
            </AppLink>{' '}
            &nbsp;
            <AppLink href="//MyMoneyKarma.com">External Link</AppLink> &nbsp;
            <AppLink href="//MyMoneyKarma.com" openInNewTab={false}>
              External Link in Same Tab
            </AppLink>{' '}
            &nbsp;
            <br />
            <AppLink to="/">
              <AppButton ml={0} size="small" label="as Default Button" />
            </AppLink>
            <AppLink to="/">
              <AppButton size="small" color="primary" label="as Primary Button" />
            </AppLink>
            <AppLink to="/">
              <AppButton mr={0} size="small" color="secondary" label="as Secondary Button" />
            </AppLink>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="AppButton" />
          <CardContent>
            <AppButton ml={0}>Default</AppButton>
            <AppButton color="primary">Primary</AppButton>
            <AppButton color="secondary">Secondary</AppButton>
            <AppButton color="error">Error</AppButton>
            <AppButton color="warning">Warning</AppButton>
            <AppButton color="info">Info</AppButton>
            <AppButton color="success">Success</AppButton>
            <AppButton color="false">False</AppButton>
            <AppButton color="true">True</AppButton>
            <AppButton color="inherit" mr={0}>
              Inherit
            </AppButton>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="AppIconButton" />
          <CardContent>
            <AppIconButton title="Default icon, no color specified" />
            <AppIconButton icon="close" color="primary" title="Close icon with Primary color" />
            <AppIconButton icon="menu" color="secondary" title="Menu icon with Secondary color" />
            <AppIconButton icon="delete" color="error" title="Delete icon with Error color" />
            <AppIconButton icon="edit" color="warning" title="Edit icon with Warning color" />
            <AppIconButton icon="dots" color="info" title="Dots icon with Info color" />
            <AppIconButton icon="filter" color="success" title="Filter icon with Success color" />
            <AppIconButton icon="visibilityoff" color="false" title="VisibilityOff icon with False color" />
            <AppIconButton icon="visibilityon" color="true" title="VisibilityOn icon with True color" />
            <AppIconButton icon="smile" color="inherit" title="Smile icon with Inherit color" />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h1">MUI Typo h1</Typography>
            <Typography variant="h2">MUI Typography h2</Typography>
            <Typography variant="h3">MUI Typography h3</Typography>
            <Typography variant="h4">MUI Typography h4</Typography>
            <Typography variant="h5">MUI Typography h5</Typography>
            <Typography variant="h6">MUI Typography h6</Typography>
            <Divider />
            <Typography variant="subtitle1">MUI Typography subtitle1</Typography>
            <Typography variant="subtitle2">MUI Typography subtitle2</Typography>
            <Typography variant="caption">MUI Typography caption</Typography>
            <Divider />
            <Typography variant="body1">
              MUI Typography body1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
              esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
              qui officia deserunt mollit anim id est laborum.
            </Typography>
            <Divider />
            <Typography variant="body2">
              MUI Typography body2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
              esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
              qui officia deserunt mollit anim id est laborum.
            </Typography>
            <Divider />
            <Typography variant="overline">MUI Typography overline</Typography>
            <Divider />
            <Typography variant="button">MUI Typography button</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AboutView;
