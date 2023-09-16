import { Typography, Toolbar, AppBar, Box, Grid, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowForward, CalendarMonth, Delete, StoreRounded, YardRounded } from '@mui/icons-material';

const CartToolBar = () => {

    return (
        <Container sx={{position: 'relative'}}>
            <AppBar position="fixed" sx={{ backgroundColor: '#383b48', marginBottom: '64px' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            textDecoration: 'none',
                            color: 'aliceblue',
                            fontSize: '24px',
                            fontWeight: 'bold',
                        }}
                    >
                        <Link to="/">Kanat Shop</Link>
                    </Typography>
                    <Box
                        minWidth="35%"
                        minHeight={70}
                        sx={{
                            background: '#00c499',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Typography variant="h6">
                            <CalendarMonth /> Календарь заказов
                        </Typography>
                        <ArrowForward />
                    </Box>
                </Toolbar>
            </AppBar>
        </Container>
    );
};

export default CartToolBar;
