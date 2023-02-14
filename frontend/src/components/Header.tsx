import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoHeader.svg";
import logoSmall from "../assets/ntnuiLogo.svg"
import {
  createStyles,
  Header,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const HEADER_HEIGHT = 60;


const useStyles = createStyles((theme) => ({
  header:{
    position:"absolute",
    background:"none",
  },

  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));



export function HeaderAction() {
  const matches = useMediaQuery('(min-width: 321px)');
  const { classes } = useStyles();
  const navigate = useNavigate();

  const logOut = async () => {
    await axios
      .get("/auth/logout")
      .then(() => {
        navigate("/");
        localStorage.setItem("isLoggedIn", "false");
      })
      .catch((err) => {
        console.log("Something went wrong while logging out");
        console.log(err);
        navigate("/");
      });
  };
  
  return (
    <Header className={classes.header} height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          {matches ?
          <img src={logo} alt="NTNUI logo" width="200px"></img>
            :
          <img src={logoSmall} alt="NTNUI logo" width="100px"></img>}
        </Group>

        <Button onClick={logOut} radius="md" sx={{ height: 30 }} data-testid="logout-button">
          Logout
        </Button>
      </Container>
    </Header>
  );
}