import { apiUrl } from '../../common/constans'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardMedia,
  Container,
  Box,
} from '@mui/material'

import { MouseEventHandler } from 'react'


interface Props {
  id: number
  create_date: string
  item_name: string
  disabled: boolean
  onDelete: MouseEventHandler<HTMLButtonElement>
  onEdit: MouseEventHandler<HTMLButtonElement>
  onAchiv: MouseEventHandler<HTMLButtonElement>
  image_small: string
}

const ItemsList = ({
  id,
  create_date,
  item_name,
  onDelete,
  onEdit,
  onAchiv,
  image_small,
  disabled
}: Props) => {
  return (
    <Card sx={{ width: 280, height:190}}>
      <CardContent >
        <Box display="flex">
        <Box width="150px" height="100px" sx={{mr:4}}> {/* Задайте желаемую ширину и высоту */}
      <img
        src={image_small}
        alt={item_name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
    <Box>
    <Typography>
          {item_name}
        </Typography>
        <Typography>
          Дата: {create_date}
        </Typography>
    </Box>
        </Box>
      </CardContent>
      <CardActions >
        <Button size="small" onClick={onDelete} disabled={disabled} variant="contained" color="error" sx={{width:90}}>
          Удалить
        </Button>
        <Button size="small" onClick={onEdit} variant="contained" color="success" sx={{width:90}}>
          Коррект
        </Button>
        <Button size="small" onClick={onAchiv} variant="contained" color="secondary" sx={{width:90}}>
          Архив
        </Button>
      </CardActions>
    </Card>
  )
}

export default ItemsList





