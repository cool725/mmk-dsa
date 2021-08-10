import { useEffect, useState, Fragment, SyntheticEvent, useCallback } from 'react';
import { useHistory } from 'react-router';
import { Card, CardContent, CardHeader, Grid, LinearProgress, TextField } from '@material-ui/core';
import { useAppStore } from '../../store';
import { AppButton } from '../../components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SHARED_CONTROL_PROPS } from '../../utils/form';
import api from '../../api';

interface DsaOption {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  entity_type: string;
  application_status: string;
  progress: string;
}

const AgentsView = () => {
  const history = useHistory();
  const [state, dispatch] = useAppStore();
  const [loading, setLoading] = useState(true);
  const [dsaLoading, setDsaLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dsaOptionsList, setDsaOptionsList] = useState<DsaOption[]>([]);
  const [dsa, setDsa] = useState<DsaOption | null>(null);

  const getDsaApplications = async (query: string, limit = 10) => {
    return api.dsa.getIncompleteDsaApplications(query, limit);
  };

  const onInputChange = async (event: SyntheticEvent, dsaSearchQuery: string) => {
    setDsaLoading(true);
    if (!dsaSearchQuery || event.type !== 'change') {
      setDsaOptionsList([]);
      setDsaLoading(false);
      return;
    }
    const dsaApplications = await getDsaApplications(dsaSearchQuery);
    setDsaLoading(false);
    setDsaOptionsList(dsaApplications);
  };

  const onChange = async (event: SyntheticEvent, dsa: DsaOption | null) => {
    if (!dsa || event.type !== 'click') {
      setDsa(null);
      return;
    }
    setDsa(dsa);
  };

  const getOptionSelected = (option: DsaOption, value: DsaOption) => {
    return option.id === value.id;
  };

  const getOptionLabel = (option: DsaOption) => {
    return `${option.first_name} ${option.last_name} (${option.email} -- ${option.phone})`;
  };

  const emulateDsa = () => {
    dispatch({ type: 'SET_VERIFIED_PHONE', payload: dsa.phone });
    dispatch({ type: 'SET_VERIFIED_EMAIL', payload: dsa.email });
    dispatch({ type: 'SET_USER_FIRSTNAME', payload: dsa.first_name });
    dispatch({ type: 'SET_USER_LASTNAME', payload: dsa.last_name });
    history.push('/');
  };

  useEffect(() => {
    setLoading(false);
    if (!open) {
      setDsaOptionsList([]);
    }
  }, [open]);

  if (loading) return <LinearProgress />;

  return (
    <form>
      <Grid container spacing={2} justify="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader style={{ textAlign: 'center' }} title="Select DSA" />
            <CardContent>
              <Autocomplete
                style={{ marginBottom: 16 }}
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                getOptionSelected={getOptionSelected}
                getOptionLabel={getOptionLabel}
                options={dsaOptionsList}
                loading={dsaLoading}
                onInputChange={onInputChange}
                onChange={onChange}
                value={dsa}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    {...SHARED_CONTROL_PROPS}
                    label="Search for DSA with incomplete applications"
                    name="dsa_search"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {dsaLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      ),
                    }}
                  />
                )}
              />
              <Grid container justify="center" alignItems="center">
                <AppButton type="button" onClick={emulateDsa} disabled={!dsa}>
                  Emulate DSA
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default AgentsView;
