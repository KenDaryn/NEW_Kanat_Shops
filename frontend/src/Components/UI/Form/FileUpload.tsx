import { ChangeEvent, ChangeEventHandler, useState } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  label: string
}

const FileUpload = ({ name, label, onChange }: Props) => {
  const [filename, setFilename] = useState('')

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilename(e.target.files[0].name)
    } else {
      setFilename('')
    }
    onChange(e)
  }

  return (
    <>
      <Typography color={grey[700]} component="h2">
        {label}
      </Typography>
      <Button
        color={'secondary'}
        variant="contained"
        component="label"
        fullWidth
		sx={{maxWidth:350}}
      >
        Фото
        <input
          name={name}
          hidden
          accept="image/*"
          type="file"
          onChange={onFileChange}
        />
      </Button>
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item xs>
          {filename?(`Название фото: ${filename}`):(null)}
        </Grid>
      </Grid>
    </>
  )
}

export default FileUpload
