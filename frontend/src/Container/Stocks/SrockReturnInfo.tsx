import * as React from 'react'
import { styled, ThemeProvider } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import { GlobalTheme } from '../..'
import {
  Container,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
} from '@mui/material'
import { useGetStockReturnByIdQuery } from '../../Store/services/stocks'
import { useNavigate, useParams } from 'react-router'
import Loading from '../../Components/UI/Loading/Loading'
import { ChangeEvent, useState } from 'react'
import {
  useSendStockMutation,
  useSendCancelReturnMutation,
} from '../../Store/services/stocks'

const StockReturnInfo = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { data: stockInfo, isLoading } = useGetStockReturnByIdQuery(
    params.id as string,
  )
  const [amount, setAmount] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Фильтруем ввод пользователя, оставляя только цифры
    const inputValue = event.target.value.replace(/[^0-9]/g, '')
    setAmount(inputValue)
  }

  // Тут надо поменять мутацию по по списанию
  const [sendStock] = useSendStockMutation()
  const [sendCancels] = useSendCancelReturnMutation()

  const sendStocks = async () => {
    const count = { itemId: params.id, count: parseInt(amount) }
    const data = await sendStock(count)
    if (!(data as { error: object }).error) {
      setAmount('')
      navigate('/stocksReturn')
    }
  }

  const sendCancel = async () => {
    const count = { itemId: params.id, count: parseInt(amount) }
    const data = await sendCancels(count)
    if (!(data as { error: object }).error) {
      setAmount('')
      navigate('/stocksReturn')
    }
  }
  const onBack = () => {
    navigate('/stocksReturn')
  }
  return (
    <ThemeProvider theme={GlobalTheme}>
      <Container sx={{ pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          className="submit"
          onClick={onBack}
        >
          Назал
        </Button>

        {isLoading && <Loading />}
        {stockInfo ? (
          <Paper elevation={3}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {stockInfo[0].item_name[0]}
                  </Avatar>
                }
                title={stockInfo[0].item_name}
                subheader={`Дата созданя ${stockInfo[0].create_date}`}
              />
              <CardMedia
                component="img"
                height="400"
                width="300"
                image={stockInfo[0].image}
                alt={stockInfo[0].item_name}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Макс дата прихода: {stockInfo[0].max_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Мин дата прихода: {stockInfo[0].min_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Количество: {stockInfo[0].qty}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Общая сумма: {stockInfo[0].total_price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Средняя цена: {stockInfo[0].avg_price}
                </Typography>
              </CardContent>
              <FormControl sx={{ ml: 1, mr: 10, maxwidth: 800 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Количество
                </InputLabel>
                <OutlinedInput
                  label="Количество"
                  id="formatted-numberformat-input"
                  type="text"
                  value={amount}
                  onChange={handleInputChange}
                />
              </FormControl>
              <CardActions disableSpacing>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  type="submit"
                  className="submit"
                  sx={{ mr: 1 }}
                  onClick={sendStocks}
                  disabled={
                    parseInt(amount) > 0 && parseInt(amount) <= stockInfo[0].qty
                      ? false
                      : true
                  }
                >
                  Склад
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  type="submit"
                  className="submit"
                  onClick={sendCancel}
                  disabled={
                    parseInt(amount) > 0 && parseInt(amount) <= stockInfo[0].qty
                      ? false
                      : true
                  }
                >
                  Списать
                </Button>
              </CardActions>
            </Card>
          </Paper>
        ) : (
          <Typography>Нет информации товару</Typography>
        )}
      </Container>
    </ThemeProvider>
  )
}
export default StockReturnInfo
