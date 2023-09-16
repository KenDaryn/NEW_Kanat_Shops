import FileUpload from '../../Components/UI/Form/FileUpload'
import FormElement from '../../Components/UI/Form/FormElement'
import { CustomError } from '../../interfaces/errors/CustomError'
import { useAddItemMutation } from '../../Store/services/items'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert, Button, Container, FormControl, Snackbar } from '@mui/material'
import SuccessPopup from '../../Components/UI/SuccessPopup/SuccessPopup'

const AddItem = () => {
  const [addItem, { error, isError, isSuccess }] = useAddItemMutation()
  interface Props {
    item_name: string
    image_small: string
  }
  const initialFormState: Props = {
    item_name: '',
    image_small: '',
  }

  const [openItemId, setOpenItemId] = useState<number | null>(null)

  const [form, setForm] = useState(initialFormState)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)

  const navigate = useNavigate()

  const handleClose = () => {
    setOpen(false)
    setShow(false)
  }

  useEffect(() => {
    setOpen(isError)
    setShow(isSuccess)
  }, [isError, isSuccess])

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const selectChangeHandler = (name: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    if (e.target.files) {
      const file = e.target.files[0]
      setForm((prevState) => ({
        ...prevState,
        [name]: file,
      }))
    }
  }

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()

    for (const [key, value] of Object.entries(form)) {
      const stringValue = typeof value === 'number' ? value.toString() : value
      formData.append(key, stringValue)
    }
    const data = await addItem(formData)
    if (!((data as unknown) as { error: object }).error) {
      navigate('/items')
      setForm(initialFormState)
    }
  }

  return (
    <Container component="section">
      <form onSubmit={submitFormHandler}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert severity="error" onClose={handleClose}>
            {(error as CustomError)?.data?.message}
          </Alert>
        </Snackbar>
        <SuccessPopup
          open={show}
          onClose={handleClose}
          message="Товар создан"
        />
        <FormControl fullWidth>
          <FormElement
            value={form.item_name}
            label="Товар"
            name="item_name"
            onChange={inputChangeHandler}
          />
        </FormControl>
        <FileUpload onChange={fileChangeHandler} name="image_small" label="" />
        <Button
          fullWidth
          sx={{ maxWidth: 350 }}
          variant="contained"
          color="success"
          type="submit"
          className="submit"
        >
          Добавить
        </Button>
      </form>
    </Container>
  )
}
export default AddItem
