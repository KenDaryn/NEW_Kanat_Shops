import React, { useEffect, useState } from 'react'
import {
  Grid,
  Typography,
  Card,
  Container,
  ThemeProvider,
  TextField,
  Button,
  Link,
  Paper,
  Box,
} from '@mui/material'
import { GlobalTheme } from '../..'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useGetActionsQuery, useDeleteActionsMutation, useEditActionsMutation } from '../../Store/services/actions'
import { useNavigate } from 'react-router'
import { log } from 'console'


const Actions = () => {
  const { data: transactions, refetch } = useGetActionsQuery()
  
  useEffect(() => {
    refetch()
  }, [refetch])
  const [sourceNameFilter, setSourceNameFilter] = useState<string>('')
  const [loginFilter, setLoginFilter] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleSourceNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSourceNameFilter(event.target.value)
  }

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFilter(event.target.value)
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  const filteredTransactions = transactions
    ? transactions.filter((transaction: any) => {
        // Фильтрация по source_name и login
        const sourceNameMatch =
          sourceNameFilter === '' ||
          transaction.source_name.includes(sourceNameFilter)
        const loginMatch =
          loginFilter === '' || transaction.login.includes(loginFilter)
        return sourceNameMatch && loginMatch
      })
    : []

  const navigate = useNavigate()
  const hadleInvoice = () => {
    navigate('/addActions')
  }

  const [deleteActions, { isSuccess }] = useDeleteActionsMutation()

  const handleDeleteAction = async(action: number) => {
    await deleteActions(action)
    refetch()
  }

  const handleCorrectItem = async(action: number) => {
    navigate(`/editActions/${action}`)
  }

  return (
    <Container>
      <ThemeProvider theme={GlobalTheme}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="h4" align="center">
              История приходов
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={hadleInvoice}
            >
              Создать приход
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            ></LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <TextField
              label="Поиск по источнику"
              value={sourceNameFilter}
              onChange={handleSourceNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <TextField
              label="Поиск по сотруднику"
              value={loginFilter}
              onChange={handleLoginChange}
              fullWidth
            />
          </Grid>
          <Container>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {filteredTransactions.map((transaction: any) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  key={transaction.invoice_number}
                >
                  <Paper sx={{ m: 2 }}>
                    <Box display="flex">
                      <Box>
                        <Box width="110px" height="75px" sx={{ mr: 4 }}>
                          {" "}
                          {/* Задайте желаемую ширину и высоту */}
                          <img
                            src={transaction.image}
                            alt={transaction.item_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <Box sx={{ ml: 1 }}>
                            <Button
                              size="small"
                              onClick={() =>
                                handleDeleteAction(transaction.invoice_number)
                              }
                              disabled={transaction.count > 0 ? true : false}
                              variant="contained"
                              color="error"
                              sx={{ width: 90 }}
                            >
                              Удалить
                            </Button>
                            <Button
                              size="small"
                              onClick={() =>
                                handleCorrectItem(transaction.invoice_number)
                              }
                              disabled={transaction.count > 0 ? true : false}
                              variant="contained"
                              color="success"
                              sx={{ width: 90 }}
                            >
                              Коррект
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Typography sx={{ ml: 1 }}>
                          Товар: {transaction.item_name}
                        </Typography>
                        <Typography sx={{ ml: 1 }}>
                          Дата: {transaction.date}
                        </Typography>
                        <Typography sx={{ ml: 1 }}>
                          Сумма: {transaction.total_price}
                        </Typography>
                        <Typography sx={{ ml: 1 }}>
                          Количество: {transaction.qty}
                        </Typography>
                        <Typography sx={{ ml: 1 }}>
                          Источник: {transaction.source_name}
                        </Typography>
                        <Typography sx={{ ml: 1 }}>
                          Сотрудник: {transaction.login}
                        </Typography>
                        <Typography sx={{ ml: 1 }}>
                          Магазин: {transaction.shop_name}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Grid>
      </ThemeProvider>
    </Container>
  );
}

export default Actions
