import FormElement from '../../Components/UI/Form/FormElement'
import { CustomError } from '../../interfaces/errors/CustomError'
import { useEditItemMutation } from '../../Store/services/items'

import BasicSelect from '../../Components/UI/Form/SelectFormElement'
import { useAppSelector } from '../../Store/hooks'
import { useNavigate } from 'react-router'
import { Container, Button, Snackbar, Alert } from '@mui/material'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export interface ItemProps {
  item_name: string
}

const EditItem = () => {
  const { id } = useParams()

  const [editItem, { error }] = useEditItemMutation()

  const [form, setForm] = useState<ItemProps>({
    item_name: '',
  })

  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

  const handleClose = () => {
    setOpen(false)
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prevState) => ({
      ...prevState,
      [name as keyof ItemProps]: value,
    }))
  }
  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.item_name) {
      const data = await editItem({ itemId: id as string, item: form })
      if (!(data as { error: object }).error) {
        navigate('/items')
      }
    }
  }

  return (
    <form onSubmit={submitFormHandler}>
      <Container component="section" maxWidth="xs" sx={{ marginTop: '100px' }}>
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
        <FormElement
          value={form.item_name}
          label="Title"
          name="item_name"
          onChange={inputChangeHandler}
        />
        <Button
          fullWidth
          variant="contained"
          color="success"
          type="submit"
          className="submit"
          disabled={form.item_name.length > 0 ? false : true}
        >
          Изменить
        </Button>
      </Container>
    </form>
  )
}

export default EditItem
