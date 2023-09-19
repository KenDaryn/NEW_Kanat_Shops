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
} from '@mui/material'
import { GlobalTheme } from '../..'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import {
//   DesktopDatePicker,
//   DateInputProps,
// } from '@mui/x-date-pickers/DatePicker'
import { useGetActionsQuery } from '../../Store/services/actions'
import { useNavigate } from 'react-router'

// Кастомный компонент DatePicker с собственным вводом
// const CustomDatePicker: React.FC<DateInputProps> = ({ value, onChange }) => {
//   return (
//     <DesktopDatePicker
//       value={value}
//       onChange={onChange}
//       renderInput={(props) => <TextField {...props} />}
//     />
//   )
// }

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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <CustomDatePicker
                value={selectedDate}
                onChange={handleDateChange}
              /> */}
            </LocalizationProvider>
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
                  <Card
                    sx={{
                      background:
                        'linear-gradient(10deg,	#FFF8DC 10%,#F5DEB3 90%)',
                    }}
                  >
                    <Typography variant="subtitle1">
                      Товар: {transaction.item_name}
                    </Typography>
                    <Typography variant="subtitle1">
                      Дата: {transaction.date}
                    </Typography>
                    <Typography variant="subtitle1">
                      Сумма: {transaction.total_price}
                    </Typography>
                    <Typography variant="subtitle1">
                      Количество: {transaction.qty}
                    </Typography>
                    <Typography variant="body2">
                      Источник: {transaction.source_name}
                    </Typography>
                    <Typography variant="body2">
                      Сотрудник: {transaction.login}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Grid>
      </ThemeProvider>
    </Container>
  )
}

export default Actions
