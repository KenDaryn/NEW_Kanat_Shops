import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useGetShopsQuery } from '../../Store/services/shops'
import { useGetAllItemsQuery } from '../../Store/services/items'
import { useAddActionsMutation } from '../../Store/services/actions'
import { useAppSelector } from '../../Store/hooks'
import { getUser } from '../../Store/user/userSelectors'
import {
  Alert,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
  ThemeProvider,
} from '@mui/material'
import { GlobalTheme } from '../..'
import { count, log } from 'console'


const AddActions = () => {
  const user = useAppSelector(getUser)
  const navigate = useNavigate()
  interface Props {
    count: string
    summ: string
    from: string
    id_shop: string
    id_item: string
  }

  const initialFormState: Props = {
    count: '',
    summ: '',
    from: '',
    id_shop: '',
    id_item: '',
  }
  const [form, setForm] = useState<Props>(initialFormState)

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const { data: shops } = useGetShopsQuery()
  const [id_shop, setIdShop] = useState('')
  const handleChangeShop = (event: SelectChangeEvent) => {
    const newValue = event.target.value
    setIdShop(newValue)
  }
  const [id_item, setIdItem] = useState('')
  const handleChangeItem = (event: SelectChangeEvent) => {
    const newValue = event.target.value
    setIdItem(newValue)
  }
  const { data: items } = useGetAllItemsQuery()

  const [addActions, { isError, isSuccess, error }] = useAddActionsMutation()

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.id_shop = id_shop
    form.id_item = id_item
    const data = await addActions(form)
        if (!(data as { error: object }).error) {
      setForm({
        count: '',
        summ: '',
        from: '',
        id_shop: '',
        id_item: '',
      })
      navigate('/actions')
    }
  }

  return (
    <ThemeProvider theme={GlobalTheme}>
      <form onSubmit={submitFormHandler}>
        <Container component="section">
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography textAlign={'center'} variant="h5">
                Создать приход
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-label">Товары</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={id_item}
                  label="Товары"
                  onChange={handleChangeItem}
                >
                  {items &&
                    items.map((item: any) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                value={form.count}
                onChange={inputChangeHandler}
                id="outlined-basic"
                label="Количество"
                variant="outlined"
                name="count"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                value={form.summ}
                onChange={inputChangeHandler}
                id="outlined-basic"
                label="Цена товара"
                variant="outlined"
                name="summ"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                value={form.from}
                onChange={inputChangeHandler}
                id="outlined-basic"
                label="От кого"
                variant="outlined"
                name="from"
                fullWidth
              />
            </Grid>
            {user.user.role === 'admin' ? (
              <Grid item xs={12} md={12}>
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
              </Grid>
            ) : 
            (null
            )}
            <Grid item xs={12} md={12}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                type="submit"
                className="submit"
                disabled = {user.user.role === 'admin'?(id_item&&form.count&&form.summ&&form.from&&id_shop?false:true):(id_item&&form.count&&form.summ&&form.from?false:true)
                  }
              >
                Приход
              </Button>
            </Grid>
          </Grid>
        </Container>
      </form>
    </ThemeProvider>
  )
}
export default AddActions
