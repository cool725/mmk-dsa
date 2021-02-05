import { Typography } from '@material-ui/core';

/**
 * Renders default Footer
 */
interface Props {
  isAuthenticated?: boolean;
}
export const Footer: React.FC<Props> = ({ isAuthenticated }) => {
  return (
    <Typography variant="caption">
      Copyright &copy; 2021
    </Typography>
  );
};

export default Footer;
