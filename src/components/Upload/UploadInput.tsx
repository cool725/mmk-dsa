import { FormEvent, useCallback, useRef, useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import { AppIcon, AppButton } from '../';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    // padding: theme.spacing(2),
  },
  avatar: {
    marginRight: theme.spacing(2),
    cursor: 'pointer',
  },
}));

/**
 * Renders "File Input" control with "Preview Image"
 */
const UploadInput: React.FC<any> = ({
  accept = 'image/*',
  className,
  alt,
  id,
  name,
  children,
  url: propUrl,
  buttonTitle,
  onFileChange,
  ...restOfProps
}) => {
  const classes = useStyles();
  const [url, setUrl] = useState(propUrl);
  const inputFileRef = useRef<HTMLInputElement>();

  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const newFile = event?.currentTarget?.files?.[0];
      if (newFile) {
        const newUrl = URL.createObjectURL(newFile);
        setUrl(newUrl);
      } else {
        setUrl(/*propUrl ||*/ '');
      }

      // Notify parent component about file changes
      if (typeof onFileChange === 'function') {
        onFileChange(event, name, newFile);
      }
    },
    [/*propUrl,*/ name, onFileChange]
  );

  const handleButtonClick = useCallback(() => {
    inputFileRef?.current?.click();
  }, [inputFileRef]);

  return (
    <>
      <input
        hidden
        type="file"
        accept
        ref={inputFileRef}
        id={id || name}
        name={name}
        onChange={handleChange}
        {...restOfProps}
      />
      <label className={classes.label} htmlFor={id || name}>
        <Avatar className={clsx(classes.avatar, className)} src={url || propUrl || ''} variant="rounded" alt={alt}>
          <AppIcon icon="image" />
        </Avatar>
        {buttonTitle ? <AppButton onClick={handleButtonClick}>{buttonTitle}</AppButton> : null}
        {children}
      </label>
    </>
  );
};

export default UploadInput;
