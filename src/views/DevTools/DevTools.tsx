import React, { useCallback } from 'react';
import { Grid, Card, CardContent, CardHeader, CardActions } from '@material-ui/core';
import { AppButton } from '../../components';
import { api } from '../../api';

/**
 * Renders "Dev Tools" view
 * url: /dev/*
 */
const DevTools = () => {
  const handleServerInfoClick = useCallback(async () => {
    const serverInfo = await api.info.server();

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
          <CardHeader title="DSA Web App" subheader="Version 0.1" />
          <CardContent>
            Public web application for DSA (Direct Selling Agent). This is part of MMK LAP product (Loan Against
            Property).
          </CardContent>
          <CardActions>
            <AppButton color="secondary" onClick={handleServerInfoClick}>
              Server Info
            </AppButton>
            <AppButton onClick={() => api.auth.refresh()}>Refresh Token</AppButton>
            <AppButton onClick={() => api.auth.logout()}>Logout User</AppButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Custom Data" subheader={'CRUD for "custom_data" collection'} />
          <CardContent>Bla bla bla</CardContent>
          <CardActions>
            <AppButton
              onClick={() =>
                api.data.create({ text: Math.random().toString(), data: { filed1: 'field1', filed2: 'field2' } })
              }
            >
              Create
            </AppButton>
            <AppButton onClick={() => api.data.read()}>Read</AppButton>
            <AppButton onClick={() => api.data.update(2, {text: 'updated'})}>Update</AppButton>
            <AppButton onClick={() => api.data.delete(3)}>Delete</AppButton>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DevTools;
