import { ChangeEvent, useCallback, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, TextField } from '@material-ui/core';
import { AppAlert, AppButton } from '../../components';
import { api } from '../../api';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

/**
 * Dev tool for "Custom Data" API
 */
const CustomData = () => {
  const [id, setId] = useState('');
  const [result, setResult] = useState<string | null | undefined>();
  const [error, setError] = useState<string | null | undefined>();

  const handleIdChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setId(event?.target?.value);
  }, []);

  const handleCreate = useCallback(async () => {
    const payload = {
      text: Math.random().toString(),
      data: { filed1: Math.random().toString(), filed2: Math.random().toString() },
    };
    const data = await api.customData.create(payload);

    if (data) {
      setError(null);
      setResult('Record created: ' + JSON.stringify(data));
      setId(String(data?.id));
    } else {
      setResult(null);
      setError('Can not create: ' + JSON.stringify(payload));
    }
  }, []);

  const handleRead = useCallback(async () => {
    const data = await api.customData.read(id);
    if (data) {
      setError(null);
      setResult('Successfully read: ' + JSON.stringify(data));
      data?.id && setId(String(data?.id));
    } else {
      setResult(null);
      setError('No data for id: "' + id + '"');
    }
  }, [id]);

  const handleUpdate = useCallback(async () => {
    const payload = { text: 'updated ' + Math.random() };
    const data = await api.customData.update(id, payload);
    if (data) {
      setError(null);
      setResult('Successfully updated: ' + JSON.stringify(data));
      data?.id && setId(String(data?.id));
    } else {
      setResult(null);
      setError('Can not update record id: "' + id + '" with payload: ' + JSON.stringify(payload));
    }
  }, [id]);

  const handleDelete = useCallback(async () => {
    const result = await api.customData.delete(id);

    if (result) {
      setError(null);
      setResult('Successfully delete record id: "' + id + '"');
      setId('');
    } else {
      setResult(null);
      setError('Can not delete record id: "' + id + '"');
    }
  }, [id]);

  return (
    <Card>
      <CardHeader title="Custom Data" subheader={'CRUD for "custom_data" collection'} />
      <CardContent>
        <TextField name="id" value={id} label="ID (Number)" onChange={handleIdChange} {...SHARED_CONTROL_PROPS} />
        {error ? (
          <AppAlert severity="error">{error}</AppAlert>
        ) : result ? (
          <AppAlert severity="success">{result}</AppAlert>
        ) : null}
      </CardContent>
      <CardActions>
        <AppButton color="success" onClick={handleCreate}>
          Create
        </AppButton>
        <AppButton onClick={handleRead}>Read</AppButton>
        <AppButton color="warning" onClick={handleUpdate}>
          Update
        </AppButton>
        <AppButton color="error" onClick={handleDelete}>
          Delete
        </AppButton>
      </CardActions>
    </Card>
  );
};

export default CustomData;
