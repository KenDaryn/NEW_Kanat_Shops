import HomePage from './Container/HomePage/HomePage'
import AllUsers from './Components/AllUsers/AllUsers'
import Items from './Container/Items/Items'
import Shops from './Container/Shops/Shops'
import Register from './Container/Register/Register'
import Login from './Container/Login/Login'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import { useAppSelector } from './Store/hooks'
import AppToolBar from './Components/UI/Layout/AppToolbar/ApptoolBar'
import EditItem from './Container/Items/EditItem'
import EditShop from './Container/Shops/EditShop'
import Actions from './Container/Actions/Actions'
import AddActions from './Container/Actions/AddActions'
import Stocks from './Container/Stocks/Stocks'
import StockInfo from './Container/Stocks/StockInfo'
import { getUser } from './Store/user/userSelectors'
import CartToolBar from './Components/UI/Layout/AppToolbar/CartToolBar'
import StocksLess from './Container/Stocks/StockLess'
import StocksSendClient from './Container/Stocks/StockSendClient'
import SendInfo from './Container/Stocks/SendInfo'
import StocksReturn from './Container/Stocks/StockReturn'
import StockReturnInfo from './Container/Stocks/SrockReturnInfo'
import StocksCancel from './Container/Stocks/StockCancel'
import Archive from './Container/Items/Archive'
import History from './Container/History/History'
import EditActions from './Container/Actions/EditActions'
import { Routes, Route, useLocation } from 'react-router-dom'
import {
  CssBaseline,
  PaletteMode,
  createTheme,
  ThemeProvider,
} from '@mui/material'
import { grey, blue, blueGrey } from '@mui/material/colors'

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      ...blue,
      main: mode === 'light' ? blue[500] : blue[400],
    },
    background: {
      default: mode === 'light' ? '#fff' : '#383b48',
      paper: mode === 'light' ? '#383b48' : blueGrey[900],
    },
    text: {
      primary: mode === 'light' ? blue[700] : blue[50],
      secondary: mode === 'light' ? grey[500] : grey[300],
    },
  },
})

const modeTheme = createTheme(getDesignTokens('light'))
function App() {
  const user = useAppSelector(getUser)
  const location = useLocation()
  const isFloristPage = location.pathname === '/florist_page'

  return (
    <ThemeProvider theme={modeTheme}>
      <CssBaseline>
        <header>
          <AppToolBar />
          {isFloristPage && <CartToolBar />}
        </header>
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/items"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <Items />
                </ProtectedRoute>
              }
            />
                        <Route
              path="/archive"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <Archive />
                </ProtectedRoute>
              }
            />

            <Route
              path="/allUsers"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <AllUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shops"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <Shops />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stocks"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <Stocks />
                </ProtectedRoute>
              }
            />
                        <Route
              path="/history"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <History />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stocksLess"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <StocksLess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stocksCancel"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <StocksCancel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editActions/:id"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <EditActions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stocksReturnInfo/:id"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <StockReturnInfo />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stocksReturn"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <StocksReturn />
                </ProtectedRoute>
              }
            />

            <Route
              path="/send"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <StocksSendClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sendInfo/:id"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <SendInfo />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stockInfo/:id"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <StockInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-item/:id"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <EditItem />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/edit-supplier/:id"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <EditShop />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/invoices"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <Invoices />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/addActions"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <AddActions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/actions"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <Actions />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/new-invoice"
              element={
                <ProtectedRoute
                  isAllowed={user.isAuthenticated}
                  redirectPath="/"
                >
                  <AddInvoice />
                </ProtectedRoute>
              }
            /> */}
          </Routes>
        </main>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
