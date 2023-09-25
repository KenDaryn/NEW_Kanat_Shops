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
  InputAdornment,
  Button,
  Box,
} from '@mui/material'
import { useGetStockByIdQuery } from '../../Store/services/stocks'
import { useNavigate, useParams } from 'react-router'
import Loading from '../../Components/UI/Loading/Loading'
import { ChangeEvent, useState } from 'react'
import {
  useSendClientMutation,
  useSendCancelMutation,
} from '../../Store/services/stocks'
import { log } from 'console'

const StockInfo = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { data: stockInfo, isLoading } = useGetStockByIdQuery(
    params.id as string,
  )

  const [amount, setAmount] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Фильтруем ввод пользователя, оставляя только цифры
    const inputValue = event.target.value.replace(/[^0-9]/g, '')
    setAmount(inputValue)
  }

  //   Надо сделать на бэке списание и выдачу клиента путем изменения статсуа operation type
  // на фронте сделать апишки
  const [sendClients] = useSendClientMutation()
  const [sendCancels] = useSendCancelMutation()

  const sendClient = async () => {
    const count = { itemId: params.id, count: parseInt(amount), shop_id:stockInfo[0].id_shop }
    
    const data = await sendClients(count)
    if (!(data as { error: object }).error) {
      setAmount('')
      navigate('/stocks')
    }
  }

  const sendCancel = async () => {
    const count = { itemId: params.id, count: parseInt(amount),shop_id:stockInfo[0].id_shop }
    const data = await sendCancels(count)
    if (!(data as { error: object }).error) {
      setAmount('')
      navigate('/stocks')
    }
  }

  const onBack = () => {
    navigate('/stocks')
  }
  return (
    <ThemeProvider theme={GlobalTheme}>
      <Container sx={{ pt: 2, width:'350px' }}>
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
              <Box width="300px" height="300px">
                <img
                  src={stockInfo[0].image}
                  alt={stockInfo[0].item_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>                        
              </Box> 
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
                  Последная цена: {stockInfo[0].price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Магазин: {stockInfo[0].shop_name}
                </Typography>
              </CardContent>
              <FormControl sx={{ ml: 1, mr: 1 }}>
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
                  onClick={sendClient}
                  disabled={
                    parseInt(amount) > 0 && parseInt(amount) <= stockInfo[0].qty
                      ? false
                      : true
                  }
                >
                  Выдать
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
export default StockInfo
