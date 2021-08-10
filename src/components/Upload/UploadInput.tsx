import { FormEvent, useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { extension } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import { api } from '../../api';
import { AppIcon, AppButton, AppAlert } from '../';

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
  const [error, setError] = useState<string>();

  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      setError(undefined); // reset any previous error

      const newFile = event?.currentTarget?.files?.[0];
      if (newFile) {
        // Check maximum file size
        if (Number(newFile?.size) > api.file.FILE_SIZE_MAX) {
          console.warn('UploadInput() - Selected file is too big! The size is', newFile?.size, 'bytes');
          setError('Selected file is too big! Please use a smaller copy.');
          return;
        }

        // File is OK, create the object for preview
        const newUrl = URL.createObjectURL(newFile);
        setUrl(newUrl);
      } else {
        setUrl(url || '');
      }

      // Notify parent component about file changes
      if (typeof onFileChange === 'function') {
        onFileChange(event, name, newFile);
      }
    },
    [/*propUrl,*/ url, name, onFileChange]
  );

  const handleButtonClick = useCallback(() => {
    inputFileRef?.current?.click();
  }, [inputFileRef]);

  const handleCloseError = useCallback(() => setError(undefined), []);

  const downloadFile = useCallback(async () => {
    const fileUrl = url || propUrl;
    const response = await fetch(fileUrl);
    const fileData = await response.blob();
    const fileExtension = extension(fileData.type);
    const downoadUrl = window.URL.createObjectURL(fileData);
    const anchorElement = document.createElement('a');
    const fileName = `${uuidv4()}.${fileExtension}`;
    anchorElement.href = downoadUrl;
    anchorElement.download = fileName;
    anchorElement.click();
  }, [url, propUrl]);

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
        {url || propUrl ? <AppButton onClick={downloadFile}>Download for Preview</AppButton> : null}
        {children}
      </label>
      {error ? (
        <AppAlert severity="error" onClose={handleCloseError}>
          {error}
        </AppAlert>
      ) : null}
    </>
  );
};

export default UploadInput;
