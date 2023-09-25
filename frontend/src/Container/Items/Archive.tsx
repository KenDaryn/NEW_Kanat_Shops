import {
  useGetAllItemsArchiveQuery,
  useActiveItemMutation
} from '../../Store/services/items'
import { CustomError } from '../../interfaces/errors/CustomError'
import { GlobalTheme } from '../..'
import { Items } from '../../interfaces/Items'
import Loading from '../../Components/UI/Loading/Loading'
import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Snackbar, ThemeProvider, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SuccessPopup from '../../Components/UI/SuccessPopup/SuccessPopup'
import noPhoto from '../../assets/no-photo.png'


const Archive = () => {
  const { data, isLoading, isError, error } = useGetAllItemsArchiveQuery()  
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [activeItem, { isSuccess }] = useActiveItemMutation()
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
    setShow(false)
  }

  const back = ()=>{
navigate('/items')
  }

  const onActive = async (itemId: number) => {
        const result = await activeItem(itemId)
        navigate('/items')
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
          message="Товар активирован"
        />
        {isLoading && <Loading />}
        <Typography variant='h4'>Архив</Typography>
        <Button variant="contained" color="info" fullWidth onClick={back}>Назад</Button>
        <Grid container>
          {items &&
            items.map((item:any) => {
              return (
                <Grid item key={item.id} xs={12} md={4}>
                  <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      sx={{ width: "100%" }}
                    >
                      {(error as CustomError)?.data?.message
                        ? "Что то пошло не так"
                        : null}
                    </Alert>
                  </Snackbar>
                  <Grid container sx={{ margin: 1 }}>
                    <Card sx={{ width: 300, height: 330 }}>
                      <Box width="250px" height="200px" sx={{ mr: 4 }}>
                        {" "}
                        {/* Задайте желаемую ширину и высоту */}
                        <img
                          src={item.image ? item.image : noPhoto}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      <CardContent>
                        <Typography
                          sx={{ m: 0 }}
                          gutterBottom
                          variant="h5"
                          component="div"
                        >
                          {item.name}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() => onActive(item.id)}
                          variant="contained"
                          color="secondary"
                          fullWidth
                        >
                          Активировать
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default Archive
