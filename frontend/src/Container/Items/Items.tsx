import AddItem from './AddItems'
import {
  useGetAllItemsQuery,
  useDeleteItemMutation,
  useArchiveItemMutation,
} from '../../Store/services/items'
import { CustomError } from '../../interfaces/errors/CustomError'
import Modal from '../../Components/UI/Modal/Modal'
import ItemsList from '../../Components/Items/ItemsList'
import { GlobalTheme } from '../..'
import AddButton from '../../Components/UI/Button/AddButton'
import { Items } from '../../interfaces/Items'
import Loading from '../../Components/UI/Loading/Loading'
import { MouseEvent, useEffect, useState } from 'react'
import { Alert, Container, Grid, Snackbar, ThemeProvider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SuccessPopup from '../../Components/UI/SuccessPopup/SuccessPopup'
import noPhoto from '../../assets/no-photo.png'

const ItemsContainer = () => {
  const { data, isLoading, isError, error } = useGetAllItemsQuery()
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [deleteItem, { isSuccess }] = useDeleteItemMutation()
  const [archiveItem] = useArchiveItemMutation()

  const [deleteItemId, setDeleteItemId] = useState<number | null>(null)
  const [uncoverForm, setUncoverForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(isError)
  }, [isError])
  const [items, setItems] = useState<Items[]>([])

  useEffect(() => {
    if (data) {
      setItems(data as [])
    }
    setShow(isSuccess)
  }, [data, isSuccess])

  const handleClose = () => {
    setOpen(false)
    setOpenModal(false)
    setShow(false)
  }

  const handleAddButtonClick = () => {
    setUncoverForm(!uncoverForm)
  }

  const handleDeleteItem = (itemId: number) => {
    setDeleteItemId(itemId)
    setOpenModal(true)
  }

  const handleAchivItem = (itemId: number) => {
    archiveItem(itemId)
  }

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      try {
        const result = await deleteItem(deleteItemId)
        if ('error' in result && result.error) {
          setOpenModal(true)
          setOpen(true)
        } else {
          setOpenModal(false)
        }
      } catch (error) {
        setOpenModal(true)
        setOpen(true)
      }
      setDeleteItemId(null)
    }
  }

  return (
    <ThemeProvider theme={GlobalTheme}>
      <Container
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <SuccessPopup
          open={show}
          onClose={handleClose}
          message="Товар удален"
        />
        {isLoading && <Loading />}
        <AddButton buttonText="Создать Товар" onClick={handleAddButtonClick} />
        {uncoverForm && <AddItem />}
        <Grid container>
          {items &&
            items.map((item) => {
              return (
                <Grid item key={item.id} xs={12} md={4}>
                  <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      sx={{ width: '100%' }}
                    >
                      {(error as CustomError)?.data?.message
                        ? 'Что то пошло не так'
                        : null}
                    </Alert>
                  </Snackbar>
                  <Modal
                    isOpen={openModal && deleteItemId === item.id}
                    onClose={handleClose}
                    title="Вы действительно хотите удалить этот товар?"
                    isLoading={isLoading}
                    actionButtonLabel="Удалить"
                    onActionButtonClick={handleConfirmDelete}
                  />
                  <Grid container sx={{ margin: 1 }}>
                    <ItemsList
                      id={item.id}
                      item_name={item.name}
                      disabled={false}
                      onDelete={() => handleDeleteItem(item.id)}
                      onEdit={() => navigate(`/edit-item/${item.id}`)}
                      image_small={item.image ? item.image : noPhoto}
                      create_date={item.create_date}
                      onAchiv={() => handleAchivItem(item.id)}
                    />
                  </Grid>
                </Grid>
              )
            })}
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default ItemsContainer
