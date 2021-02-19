import { Theme, makeStyles } from '@material-ui/core/styles';

export const formStyles = (theme: Theme) => ({
  width: '100%',
  maxWidth: '40rem', // 640px
  // maxWidth: '32rem', // 512px
});

export const useFormStyles = makeStyles((theme: Theme) => ({
  formBody: {
    ...formStyles(theme),
  },
}));
