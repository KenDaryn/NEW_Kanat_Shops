import { useAppSelector } from '../../Store/hooks'
import { getUser } from '../../Store/user/userSelectors'
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  ThemeProvider,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { GlobalTheme } from '../..'

const HomePage = () => {
  const user = useAppSelector(getUser)

  const style = {
    background: 'linear-gradient(10deg,	#FFF8DC 10%,#F5DEB3 90%)',
    boxShadow: '0 3px 5px 2px 	#808080',
    backgroundSize: '200% 100%',
    animation: '$progress 5s linear infinite',
    mt: 2,
    mb: 2,
    color: 'black',
    ':hover': {
      boxShadow: 30,
      background: '#d3d3d3',
      transform: 'scale(1.2)',
    },
  }
  return (
    <ThemeProvider theme={GlobalTheme}>
      <Container
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '50px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0px',
            gap: '20px',
          }}
        >
          <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
            Kanat Shop CRM
          </Typography>
        </Box>
        {user.isAuthenticated ? (
          <Container>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                '& > :not(style)': {
                  m: 1,
                  width: 250,
                },
              }}
            >
              {user.user.role === 'admin' ? (
                <>
                  <Paper
                    component={Link}
                    to="/register"
                    elevation={15}
                    sx={style}
                  >
                    <Typography
                      align="center"
                      variant="h6"
                      sx={{ pt: 1, pb: 1, color: 'black' }}
                    >
                      Регистрация
                    </Typography>
                  </Paper>
                  <Paper
                    component={Link}
                    to="/allUsers"
                    elevation={15}
                    sx={style}
                  >
                    <Typography
                      align="center"
                      variant="h6"
                      sx={{ pt: 1, pb: 1, color: 'black' }}
                    >
                      Все пользователи
                    </Typography>
                  </Paper>
                  <Paper component={Link} to="/shops" elevation={15} sx={style}>
                    <Typography
                      align="center"
                      variant="h6"
                      sx={{ pt: 1, pb: 1, color: 'black' }}
                    >
                      Магазины
                    </Typography>
                  </Paper>
                </>
              ) : null}
              {user.user.role === 'admin' || user.user.role === 'manager' ? (
              <Paper component={Link} to="/items" elevation={15} sx={style}>
              <Typography
              align="center"
              variant="h6"
              sx={{ pt: 1, pb: 1, color: 'black' }}
              >Каталог товаров</Typography>
                                    </Paper>
                  
                  ):(null)}
              <Paper
                component={Link}
                to="/stocksLess"
                elevation={15}
                sx={style}
              >
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ pt: 1, pb: 1, color: 'black' }}
                >
                  Меньше 10
                </Typography>
              </Paper>

              <Paper component={Link} to="/actions" elevation={15} sx={style}>
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ pt: 1, pb: 1, color: 'black' }}
                >
                  Приходы
                </Typography>
              </Paper>
              <Paper component={Link} to="/stocks" elevation={15} sx={style}>
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ pt: 1, pb: 1, color: 'black' }}
                >
                  Склад
                </Typography>
              </Paper>
              <Paper
                component={Link}
                to="/send"
                elevation={15}
                sx={style}
              >
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ pt: 1, pb: 1, color: 'black' }}
                >
                  Выдан
                </Typography>
              </Paper>
              <Paper component={Link} to="/stocksReturn" elevation={15} sx={style}>
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ pt: 1, pb: 1, color: 'black' }}
                >
                  Возврат
                </Typography>
              </Paper>
              <Paper component={Link} to="/stocksCancel" elevation={15} sx={style}>
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ pt: 1, pb: 1, color: 'black' }}
                >
                  Списан
                </Typography>
              </Paper>
              <Paper component={Link} to="/history" elevation={15} sx={style}>
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ pt: 1, pb: 1, color: 'black' }}
                >
                  История
                </Typography>
              </Paper>
            </Box>
          </Container>
        ) : null}
      </Container>
    </ThemeProvider>
  )
}

export default HomePage
