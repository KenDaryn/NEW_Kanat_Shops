import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Card,
  Container,
  ThemeProvider,
  TextField,
} from '@mui/material'
import { GlobalTheme } from '../..'
import { useGetStocksLessQuery } from '../../Store/services/stocks'
import { useNavigate } from 'react-router'

const StocksLess = () => {
  const { data: stocks, refetch } = useGetStocksLessQuery()
  useEffect(() => {
    refetch()
  }, [refetch])
  const [sourceNameFilter, setSourceNameFilter] = useState<string>('')

  const handleSourceNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSourceNameFilter(event.target.value)
  }

  const filteredStocks = stocks
    ? stocks.filter((stock: any) => {
        const sourceNameMatch =
          sourceNameFilter === '' || stock.item_name.includes(sourceNameFilter)
        return sourceNameMatch
      })
    : []

  const navigate = useNavigate()
  const hadleStockInfo = (id_item: string,id_shop:string) => {
    navigate(`/stockInfo/${id_item}_${id_shop}`)
  }
  return (
    <Container>
      <ThemeProvider theme={GlobalTheme}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="h4" align="center">
              Товары меньше 10
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <TextField
              label="Поиск по товару"
              value={sourceNameFilter}
              onChange={handleSourceNameChange}
              fullWidth
            />
          </Grid>
          <Container>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {filteredStocks &&
                filteredStocks.map((stocks: any) => (
                  <Grid item xs={12} sm={4} md={4} key={stocks.item_id}>
                    <Paper elevation={3}>
                      <Card
                        sx={{
                          background:
                            'linear-gradient(10deg,	#FFF8DC 10%,#F5DEB3 90%)',
                        }}
                        onClick={() => hadleStockInfo(stocks.item_id, stocks.id_shop)}
                      >
                        <Typography sx={{ pl: 1, pt: 1 }}>
                          Товар: {stocks.item_name}
                        </Typography>
                        <Typography sx={{ pl: 1 }}>
                          Сумма: {stocks.total_price}
                        </Typography>
                        <Typography sx={{ pl: 1 }}>
                          Количество: {stocks.qty}
                        </Typography>
                        <Typography sx={{ pl: 1 }}>
                          Последная цена: {stocks.price}
                        </Typography>
                        <Typography sx={{ pl: 1 }}>
                          Магазин: {stocks.shop_name}
                        </Typography>
                      </Card>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Container>
        </Grid>
      </ThemeProvider>
    </Container>
  )
}

export default StocksLess
