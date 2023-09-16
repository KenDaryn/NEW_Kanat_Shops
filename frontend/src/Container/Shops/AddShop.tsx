import FormElement from '../../Components/UI/Form/FormElement'
import { CustomError } from '../../interfaces/errors/CustomError'
import { useAddShopsMutation } from '../../Store/services/shops'
import SuccessPopup from '../../Components/UI/SuccessPopup/SuccessPopup'
import { Container, Button, Snackbar, Alert } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { useNavigate } from 'react-router'

const AddShops = () => {
  const [addShop, { isError, isSuccess, error }] = useAddShopsMutation()
  interface Props {
    name: string
    address: string
  }

  const initialFormState: Props = {
    name: '',
    address: '',
  }

  const [form, setForm] = useState<Props>(initialFormState)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setOpen(isError)
    setShow(isSuccess)
  }, [isError, isSuccess])

  const handleClose = () => {
    setOpen(false)
    setShow(false)
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = await addShop(form)
    if (!(data as { error: object }).error) {
      setForm({
        name: '',
        address: '',
      })
      navigate('/shops')
    }
  }

  return (
    <form onSubmit={submitFormHandler}>
      <Container component="section" maxWidth="xs">
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert severity="error" onClose={handleClose}>
            {(error as CustomError)?.data?.message
              ? 'Что то пошло не так!'
              : null}
          </Alert>
        </Snackbar>
        <SuccessPopup
          open={show}
          onClose={handleClose}
          message="Магазин добавлен"
        />
        <FormElement
          value={form.name}
          label="Название магазина"
          name="name"
          onChange={inputChangeHandler}
        />
        <FormElement
          value={form.address}
          label="Адрес"
          name="address"
          onChange={inputChangeHandler}
        />
        <LoadingButton
          loading={false}
          fullWidth
          variant="contained"
          color="success"
          type="submit"
          className="submit"
          sx={{ marginBottom: 2, marginTop: 3 }}
        >
          Добавить
        </LoadingButton>
      </Container>
    </form>
  )
}
export default AddShops
