// Добавить изменение пользователя
// Добавить изменения магазина
// Изменить на светлую тему
// Надо продумать логику disabled
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Stack,
  Snackbar,
  Alert,
  ThemeProvider,
} from '@mui/material'
import { GlobalTheme } from '../..'

import {
  useGetUsersQuery,
  useChangeMutation,
} from '../../Store/services/allusers'
import {useGetRolesQuery} from '../../Store/services/role'
import { useGetShopsQuery } from '../../Store/services/shops'

const AllUsers = () => {
  const { data: shops } = useGetShopsQuery()
  const { data:roles} = useGetRolesQuery()

  const [id_shop, setIdShop] = useState('')
  const [id_role, setIdRole] = useState('')
  const handleChangeShop = (event: SelectChangeEvent) => {
    const newValue = event.target.value
    setIdShop(newValue)
  }

  const handleChangeRole = (event: SelectChangeEvent) => {
    const newValue = event.target.value
    setIdRole(newValue)
  }

  const [status, setStatus] = useState(false)
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const { data: users, refetch } = useGetUsersQuery()

  const [change, error] = useChangeMutation()
  const [username, setUsername] = useState('')

  useEffect(() => {
    refetch()
  }, [refetch])

  interface UserFormChange {
    username: string
    password: string
  }

  const handleChangeUser = (event: SelectChangeEvent) => {
    setUsername(event.target.value as string)
  }

  const [state, setState] = useState<UserFormChange>({
    username: '',
    password: '',
  })

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    state.username = username
    const ChangeUser = {
      username: username,
      password: state.password,
      id_shops: id_shop,
      id_role: id_role
    }
    await change(ChangeUser)
    setState({
      username: '',
      password: '',
    })
    if (!error.isError) {
      setStatus(true)
    } else {
      setStatus(false)
    }
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => {
      return { ...prevState, [name]: value }
    })
  }

  return (
    <Container>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={status ? 'success' : 'warning'}
            sx={{ width: '100%' }}
          >
            {status ? 'Обновление прошло успешно' : 'Что то пошло не так!'}
          </Alert>
        </Snackbar>
      </Stack>
      <form autoComplete="off" onSubmit={submitFormHandler}>
        <Grid container direction="column" spacing={2} sx={{ mt: 5 }}>
          <Grid item xs>
            <ThemeProvider theme={GlobalTheme}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">User</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={username}
                  label="User"
                  onChange={handleChangeUser}
                >
                  {users &&
                    users.map((user: any) => (
                      <MenuItem value={user.login} key={user.id}>
                        {user.login}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </ThemeProvider>
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              id="password"
              label="Password"
              value={state.password}
              onChange={inputChangeHandler}
              name="password"
              // disabled={state.username ? false : true}
            />
          </Grid>
          <Grid item xs>
            <ThemeProvider theme={GlobalTheme}>
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
              <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Роль</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={id_role}
                  label="Роль"
                  onChange={handleChangeRole}
                >
                  {roles &&
                    roles.map((role: any) => (
                      <MenuItem value={role.id} key={role.id}>
                        {role.role}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </ThemeProvider>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={
                state.password || id_shop || id_role ?false : true
              }
              onClick={handleClick}
              sx={{ mt: 2 }}
            >
              Изменить
            </Button>
          </Grid>
        </Grid>
      </form>
      <ThemeProvider theme={GlobalTheme}>
        <Grid container sx={{ mb: 2 }} direction="row">
          {users &&
            users.map((user: any) => (
              <Card sx={{ maxWidth: 500, m: 3 }} key={user.id}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ color: 'black' }}
                  >
                    Пользователь: {user.login}
                  </Typography>
                  <Typography
                    gutterBottom
                    component="div"
                    sx={{ color: 'black' }}
                  >
                    Роль: {user.role_name}
                  </Typography>
                  <Typography
                    gutterBottom
                    component="div"
                    sx={{ color: 'black' }}
                  >
                    Магазин: {user.shop_name}
                  </Typography>
                  <Typography
                    gutterBottom
                    component="div"
                    sx={{ color: 'black' }}
                  >
                    Регистрации: {user.create_date}
                  </Typography>
                  <Typography
                    gutterBottom
                    component="div"
                    sx={{ color: 'black' }}
                  >
                    Обновляение: {user.last_update_date}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Grid>
      </ThemeProvider>
    </Container>
  )
}

export default AllUsers
