import { Theme, makeStyles } from '@material-ui/core/styles';
import { formStyle } from '../utils/styles';

export const useFormStyles = makeStyles((theme: Theme) => ({
  formBody: {
    ...formStyle(theme),
  },
}));
