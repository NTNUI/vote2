import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoHeader.svg";
import logoSmall from "../assets/ntnuiLogo.svg"
import {
  Header,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useStyles } from "../styles/headerStyles";


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
    <Header className={classes.header} sx={{ borderBottom: 0 }} height={60}>
      <Container className={classes.inner} fluid>
        <Group>
          {matches ?
          <img src={logo} alt="NTNUI logo" width="200px"></img>
            :
          <img src={logoSmall} alt="NTNUI logo" width="100px"></img>}
        </Group>

        <Button variant="subtle" style={{color:"white", fontWeight:200}} onClick={logOut} radius="md" sx={{ height: 30 }} data-testid="logout-button">
          Logout
        </Button>
      </Container>
    </Header>
  );
}