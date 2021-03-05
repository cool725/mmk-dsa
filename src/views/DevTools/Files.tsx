import { ChangeEvent, useCallback, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, TextField } from '@material-ui/core';
import { AppAlert, AppButton } from '../../components';
import { api } from '../../api';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

/**
 * Dev tool for "Files" API
 */
const Files = () => {
  const [id, setId] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState<Blob>();
  const [result, setResult] = useState<string | null | undefined>();
  const [error, setError] = useState<string | null | undefined>();

  function resetMessages() {
    setResult(null);
    setError(null);
  }

  const handleIdChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setId(event?.target?.value);
    resetMessages();
  }, []);

  const handleFileNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event?.target?.value);
    resetMessages();
  }, []);

  const handleFileChange = useCallback(({ target }: any) => {
    console.log('target.files:', target?.files);
    setFileName(target?.files?.[0]?.name?.trim());

    if (!target?.files?.[0]) return; // Thats all for now, no file was selected.

    setFileData(target.files[0]);

    // const fileReader = new FileReader();
    // fileReader.readAsDataURL(target?.files?.[0]);

    // fileReader.onload = (event: any) => {
    //   setFileData(event?.target?.result);
    //   resetMessages();
    // };
  }, []);

  const handleCreate = useCallback(async () => {
    const payload = {
      title: 'Created by DevTools',
      filename_download: fileName,
      data: fileData,
    };
    const data = await api.file.create(payload);
    if (data) {
      setError(null);
      setResult('Record created: ' + JSON.stringify(data));
      setId(String(data?.id));
    } else {
      setResult(null);
      delete payload.data;
      setError('Can not create: ' + JSON.stringify(payload));
    }
  }, [fileData, fileName]);

  const handleRead = useCallback(async () => {
    const data = await api.file.read(id);
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
    const payload = {
      title: 'Updated by DevTools',
      filename_download: fileName,
      data: fileData,
    };
    const data = await api.file.update(id, payload);
    if (data) {
      setError(null);
      setResult('Successfully updated: ' + JSON.stringify(data));
      data?.id && setId(String(data?.id));
    } else {
      setResult(null);
      delete payload.data;
      setError('Can not update record id: "' + id + '" with payload: ' + JSON.stringify(payload));
    }
  }, [id, fileData, fileName]);

  const handleDelete = useCallback(async () => {
    const result = await api.file.delete(id);
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
      <CardHeader title="Files" subheader={'CRUD for files'} />
      <CardContent>
        <input id="fileSample" type="file" onChange={handleFileChange} />
        <br /> <br />
        <TextField name="id" value={id} label="ID (UUID)" onChange={handleIdChange} {...SHARED_CONTROL_PROPS} />
        <br /> <br />
        <TextField
          name="fileName"
          value={fileName}
          label="File Name"
          onChange={handleFileNameChange}
          {...SHARED_CONTROL_PROPS}
        />
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

export default Files;
