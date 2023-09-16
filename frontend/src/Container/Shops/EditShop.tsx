// import FormElement from '../../Components/UI/Form/FormElement'
import { CustomError } from '../../interfaces/errors/CustomError'
import { useNavigate } from 'react-router'
import { Container, Button, Snackbar, Alert, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
interface Props {
  name_supplier: string
  email: string
  phone: string
  address: string
  comment: string
}

const EditSupplier = () => {
  // const { id } = useParams()

  // const [form, setForm] = useState<Props>({
  //   name_supplier: '',
  //   email: '',
  //   phone: '',
  //   address: '',
  //   comment: '',
  // })

  // const [open, setOpen] = useState(false)

  // const navigate = useNavigate()

  // const handleClose = () => {
  //   setOpen(false)
  // }

  // const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target

  //   setForm((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }))
  // }

  // const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  // }

  // return (
  //   <form onSubmit={submitFormHandler}>
  //     <Container component="section" maxWidth="xs" sx={{ marginTop: '100px' }}>
  //       <Snackbar
  //         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  //         open={open}
  //         autoHideDuration={3000}
  //         onClose={handleClose}
  //       >
  //         <Alert severity="error" onClose={handleClose}></Alert>
  //       </Snackbar>
  //       <Typography sx={{ color: 'black' }} textAlign="center" variant="h5">
  //         Редактирование магазина
  //       </Typography>
  //       <FormElement
  //         value={form.name_supplier}
  //         label="Название магазина"
  //         name="name_supplier"
  //         onChange={inputChangeHandler}
  //       />
  //       <FormElement
  //         value={form.address}
  //         label="Адрес"
  //         name="address"
  //         onChange={inputChangeHandler}
  //       />
  //       <Button
  //         fullWidth
  //         variant="contained"
  //         color="success"
  //         type="submit"
  //         className="submit"
  //         sx={{ marginBottom: 2, marginTop: 3 }}
  //         disabled={true}
  //       >
  //         Изменить
  //       </Button>
  //     </Container>
  //   </form>
  // )
}

export default EditSupplier
