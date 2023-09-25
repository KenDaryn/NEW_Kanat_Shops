import * as React from "react";
import { styled, ThemeProvider } from "@mui/material/styles";
import { GlobalTheme } from "../..";
import { useGetActionsByInvoiceNumberQuery, useEditActionsMutation } from "../../Store/services/actions";
import { useGetAllItemsQuery } from '../../Store/services/items'
import { useGetShopsQuery } from '../../Store/services/shops'
import { log } from "console";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from 'react-router'
import { useAppSelector } from '../../Store/hooks'
import { getUser } from '../../Store/user/userSelectors'


export interface ActionProps {
  item_id: number;
  source_name: string;
  price: string;
  id_shop: number;
  count: string;
}

const EditActions = () => {
  const user = useAppSelector(getUser)
  const params = useParams();
  const { data: actionsInfo, refetch } = useGetActionsByInvoiceNumberQuery(
    params.id as string
  );
  useEffect(() => {
    refetch()
  }, [refetch])
  
  const { data: items } = useGetAllItemsQuery();
  const { data: shops } = useGetShopsQuery();

  const [item, setItem] = React.useState('');

  const handleItem = (event: SelectChangeEvent) => {
    setItem(event.target.value as string);
  };

  const [shop, setShop] = React.useState('');

  const handleShop = (event: SelectChangeEvent) => {
    setShop(event.target.value as string);
  };
  
  const [source, setSource] = React.useState('');
  const inputSource = (e: ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value as string);
  }
  const [qty, setQty] = React.useState('');
  const inputQty = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    setQty(inputValue);
  }
  const [price, setPrice] = React.useState('');
  const inputPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    setPrice(inputValue);
  };

  const [editActions, { error }] = useEditActionsMutation()
  const navigate = useNavigate()
  const sendAction = async () => {
    const sendInfo = {
      item_id: item ? item : actionsInfo[0].item_id,
      source_name: source ? source : actionsInfo[0].source_name,
      price: price ? price : actionsInfo[0].price,
      id_shop: shop ? shop : actionsInfo[0].id_shop,
      qty: qty ? qty : actionsInfo[0].qty,
      count: actionsInfo[0].qty,
    };
    
    const data = await editActions({
      invoice_number: params.id as string,
      invoice_body: sendInfo,
    });
    console.log(({invoice_body: sendInfo}));
    
        if (!(data as { error: object }).error) {
          setItem('')
          setShop('')
          setSource('')
          setQty('')
          setPrice('')
      navigate('/actions')
    }
  }

  return (
    <ThemeProvider theme={GlobalTheme}>
      <Container sx={{ pt: 1, minWidth: "300px" }}>
        {actionsInfo ? (
          <>
            <Typography sx={{ pb: 1 }} variant="h4" textAlign={"center"}>
              Корректировка
            </Typography>
            <Typography sx={{ pb: 1 }}>
              Товар: {actionsInfo[0].item_name}
            </Typography>
            <FormControl fullWidth sx={{ pb: 1 }}>
              <InputLabel id="demo-simple-select-label">Товар</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={item}
                label="Товар"
                onChange={handleItem}
              >
                {items &&
                  items.map((item: any) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Typography sx={{ pb: 1 }}>
              Источник: {actionsInfo[0].source_name}
            </Typography>
            <TextField
              sx={{ pb: 1 }}
              fullWidth
              id="outlined-basic"
              label="Источник"
              variant="outlined"
              onChange={inputSource}
            />
            <Typography sx={{ pb: 1 }}>
              Количество: {actionsInfo[0].qty}
            </Typography>
            <TextField
              sx={{ pb: 1 }}
              fullWidth
              id="outlined-basic"
              label="Количество"
              variant="outlined"
              value={qty}
              onChange={inputQty}
            />
            <Typography sx={{ pb: 1 }}>Цена: {actionsInfo[0].price}</Typography>
            <TextField
              sx={{ pb: 1 }}
              fullWidth
              label="Цена"
              variant="outlined"
              id="formatted-numberformat-input"
              type="text"
              value={price}
              onChange={inputPrice}
            />
            {user.user.role === "admin" ? (
              <>
                <Typography sx={{ pb: 1 }}>
                  Магазин: {actionsInfo[0].shop_name}
                </Typography>
                <FormControl fullWidth sx={{ pb: 1 }}>
                  <InputLabel id="demo-simple-select-label">Товар</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={shop}
                    label="Магазин"
                    onChange={handleShop}
                  >
                    {shops &&
                      shops.map((shop: any) => (
                        <MenuItem value={shop.id} key={shop.id}>
                          {shop.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
            ) : null}
            <Button
              fullWidth
              variant="contained"
              color="success"
              type="submit"
              className="submit"
              disabled={item || shop || source || qty || price ? false : true}
              onClick={sendAction}
            >
              Обновить
            </Button>
          </>
        ) : (
          <Typography>Нет информации по приходую</Typography>
        )}
      </Container>
    </ThemeProvider>
  );
};
export default EditActions;
