// Починить бэк
// Добавить возможность ввода магазина
import { UserForm } from '../../interfaces/RegisterForm'
import { useSignUpMutation } from '../../Store/services/auth'
import { CustomError } from '../../interfaces/errors/CustomError'
import FormElement from '../../Components/UI/Form/FormElement'
import { useGetShopsQuery } from '../../Store/services/shops'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import {
  Container,
  Typography,
  Grid,
  Button,
  Link,
  Box,
  Snackbar,
  Alert,
  SelectChangeEvent,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  ThemeProvider
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { LockOutlined } from '@mui/icons-material'
import { GlobalTheme } from '../..';

const Register = () => {
  const { data: shops } = useGetShopsQuery()
  const [id_shop, setIdShop] = useState('')

  const [form, setForm] = useState<UserForm>({
    username: '',
    password: '',
  })

  const handleChangeShop = (event: SelectChangeEvent) => {
    const newValue = event.target.value
    setIdShop(newValue)
  }
  const [signUp, { isError, error }] = useSignUpMutation()

  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setOpen(isError)
  }, [isError])

  const handleClose = () => {
    setOpen(false)
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const SendForm = {
      username: form.username,
      password: form.username,
      id_shops: id_shop,
    }

    const data = await signUp(SendForm)
    if (!(data as { error: object }).error) {
      setForm({
        username: '',
        password: '',
      })
      setIdShop('')
      navigate('/allUsers')
    }
  }

  return (
    <ThemeProvider theme={GlobalTheme}>
    <Container component="section" maxWidth="xs">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {(error as CustomError)?.data?.message === 'User already exist!'
            ? 'Такой пользователь уже есть!'
            : 'Что то пошло не так!'}
        </Alert>
      </Snackbar>
      <Box>
        <Typography
          component="h1"
          variant="h5"
          textAlign={'center'}
          sx={{ mt: 15, mb: 2 }}
        >
          Регистрация
        </Typography>
        <Box>
          <form onSubmit={submitFormHandler}>
            <Grid container spacing={1}>
              <FormElement
                required
                value={form.username}
                onChange={inputChangeHandler}
                name="username"
                label="Логин"
              />
              <FormElement
                required
                value={form.password}
                onChange={inputChangeHandler}
                type="password"
                name="password"
                label="Пароль"
              />
            </Grid>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Магазин</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={id_shop}
                label="Магазин"
                onChange={handleChangeShop}
              >
                {shops &&
                  shops.map((shop: any) => (
                    <MenuItem value={shop.id} key={shop.id}>
                      {shop.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={
                // id_shop.length > 0 &&
                form.username.length > 0 &&
                form.password.length > 0
                  ? false
                  : true
              }
              sx={{ marginTop: 3, marginBottom: 2 }}
            >
              Зарегистрироваться
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
    </ThemeProvider>
  )
}

export default Register
