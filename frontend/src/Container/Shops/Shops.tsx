import AddShops from './AddShop'
import { IShops } from '../../interfaces/IShops'
import { CustomError } from '../../interfaces/errors/CustomError'
import Modal from '../../Components/UI/Modal/Modal'
import {
  Alert,
  Container,
  Grid,
  Snackbar,
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  ThemeProvider,
} from '@mui/material'
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { GlobalTheme } from '../..'
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone'
import QueueTwoToneIcon from '@mui/icons-material/QueueTwoTone'
import SignpostTwoToneIcon from '@mui/icons-material/SignpostTwoTone'
import InsertCommentTwoToneIcon from '@mui/icons-material/InsertCommentTwoTone'
import PersonPinTwoToneIcon from '@mui/icons-material/PersonPinTwoTone'
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone'
import Loading from '../../Components/UI/Loading/Loading'
import {
  useGetShopsQuery,
  useDeleteShopMutation,
} from '../../Store/services/shops'

const Shops = () => {
  const { data: shops, refetch } = useGetShopsQuery()
  const [deleteShop, { isSuccess }] = useDeleteShopMutation()
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openItemId, setOpenItemId] = useState<number | null>(null)
  const [uncoverForm, setUncoverForm] = useState(false)
  const [shopsId, setShopsId] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleClose = () => {
    setOpen(false)
    setOpenModal(false)
  }

  const handleClick = (itemId: number) => {
    setOpenItemId(itemId === openItemId ? null : itemId)
  }

  const handleAddButtonClick = () => {
    setUncoverForm(!uncoverForm)
  }

  const handleDelete = async (shopId: number): Promise<void> => {
    deleteShop(shopId)
    setOpenModal(true)
  }

  return (
    <ThemeProvider theme={GlobalTheme}>
      <Container>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          sx={{
            background: 'linear-gradient(10deg,	#FFF8DC 10%,#d6d3ea 90%)',
            borderRadius: 2,
            color: 'black',
          }}
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              sx={{ textAlign: 'center' }}
            >
              <Typography variant="h4">База Магазинов</Typography>
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemButton onClick={handleAddButtonClick}>
              <ListItemIcon>
                <QueueTwoToneIcon sx={{ width: 35, height: 35 }} />
              </ListItemIcon>
              <Typography variant="h5">Магазин</Typography>
            </ListItemButton>
          </ListItem>
          {uncoverForm && <AddShops />}
          {shops &&
            shops.map((shop: any) => {
              const isItemOpen = shop.id === openItemId
              return (
                <Grid key={shop.id}>
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
                      {/* {(error as CustomError)?.data?.message} */}
                    </Alert>
                  </Snackbar>
                  <ListItemButton onClick={() => handleClick(shop.id)}>
                    <ListItemIcon>
                      <StoreTwoToneIcon sx={{ width: 35, height: 35 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography style={{ color: 'black' }}>
                          {shop.name}
                        </Typography>
                      }
                    />
                    {/* <IconButton
                      onClick={() => navigate(`/edit-supplier/${shop.id}`)}
                      aria-label="settings"
                    >
                      <ModeEditTwoToneIcon sx={{ width: 35, height: 35 }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(shop.id)}
                      aria-label="settings"
                    >
                      <DeleteForeverTwoToneIcon
                        sx={{ width: 35, height: 35 }}
                      />
                    </IconButton> */}
                    {isItemOpen ? (
                      <ExpandLessTwoToneIcon
                        onClick={() => {
                          setShopsId(0)
                        }}
                      />
                    ) : (
                      <ExpandMoreTwoToneIcon
                        onClick={() => {
                          setShopsId(shop.id)
                        }}
                      />
                    )}
                  </ListItemButton>
                  <Collapse
                    in={isItemOpen}
                    timeout="auto"
                    unmountOnExit
                    sx={{ backgroundColor: '#ddd5d3' }}
                  >
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText>
                          <SignpostTwoToneIcon />
                          {shop.address}
                        </ListItemText>
                      </ListItemButton>
                    </List>
                  </Collapse>
                </Grid>
              )
            })}
        </List>
      </Container>
    </ThemeProvider>
  )
}

export default Shops
