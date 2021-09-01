import { SvgIcon } from '@material-ui/core';
// SVG assets
import { ReactComponent as LogoIcon } from './logo.svg';
// Material Icons
import DefaultIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import DayNightIcon from '@material-ui/icons/Brightness4';
import NightIcon from '@material-ui/icons/Brightness3';
import DayIcon from '@material-ui/icons/Brightness5';
import InfoIcon from '@material-ui/icons/Info';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import CameraIcon from '@material-ui/icons/Camera';
import ImageIcon from '@material-ui/icons/Image';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

/**
 * How to use:
 * 1. Import all required MUI or other SVG icons into this file.
 * 2. Add icons with "unique lowercase names" into ICONS object.
 * 3. Use icons everywhere in the App by their names in <AppIcon name="xxx" /> component
 * Important: properties of ICONS object MUST be lowercase!
 * Note: You can use camelCase or UPPERCASE in the <AppIcon name="someIconByName" /> component
 */
const ICONS: Record<string, React.ComponentType> = {
  default: DefaultIcon,
  logo: () => (
    <SvgIcon>
      <LogoIcon />
    </SvgIcon>
  ),
  close: CloseIcon,
  dots: MoreVertIcon,
  menu: MenuIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  settings: SettingsIcon,
  logout: ExitToAppIcon,
  visibilityon: VisibilityIcon,
  visibilityoff: VisibilityOffIcon,
  notifications: NotificationsIcon,
  filter: FilterListIcon,
  smile: InsertEmoticonIcon,
  account: AccountCircle,
  search: SearchIcon,
  daynight: DayNightIcon,
  night: NightIcon,
  day: DayIcon,
  info: InfoIcon,
  signup: PersonAddIcon,
  login: PersonIcon,
  home: HomeIcon,
  camera: CameraIcon,
  image: ImageIcon,
  cloudupload: CloudUploadIcon,
  clouddownload: CloudDownloadIcon,
};

/**
 * Renders SVG icon by given Icon name
 * @param {string} [props.name] - name of the Icon to render
 * @param {string} [props.icon] - name of the Icon to render
 */
interface Props {
  name?: string; // Icon's name
  icon?: string; // Icon's name alternate prop
}
const AppIcon: React.FC<Props> = ({ name, icon, ...restOfProps }) => {
  const iconName = (name || icon || 'default').trim().toLowerCase();
  const ComponentToRender = ICONS[iconName] || DefaultIcon;
  return <ComponentToRender {...restOfProps} />;
};

export default AppIcon;
