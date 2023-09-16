import { apiUrl } from '../../common/constans'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardMedia,
  Container,
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
}: Props) => {
  return (
    <Card sx={{ width: 345 }}>
      <CardMedia
        component="img"
        alt={item_name}
        height="345"
        width="345"
        image={image_small}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item_name}
        </Typography>
        <Typography gutterBottom component="div">
          Дата: {create_date}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onDelete}>
          Удалить
        </Button>
        <Button size="small" onClick={onEdit}>
          Корректировать
        </Button>
        <Button size="small" onClick={onAchiv}>
          Архив
        </Button>
      </CardActions>
    </Card>
  )
}

export default ItemsList
