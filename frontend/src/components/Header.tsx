import React from "react";
import { Button, createStyles } from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoHeader.svg";

const useStyles = createStyles((theme) => ({
    header: {
		height: '100%',
        margin: 0,
		display: 'flex',
        alignItems: 'center',
		justifyContent: 'space-between'
        
	},
    logout: {
		color: "white",
        background: "none",
        fontSize: '1.2rem',
	},
}))

function Header() {
  const navigate = useNavigate();
  const { classes } = useStyles()

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
    <div className={classes.header}>
      <img src={logo} alt="NTNUI logo" width="200px"></img>
      <Button className={classes.logout} type="submit" onClick={logOut}>Log Out </Button>
    </div>
  );
}

export default Header;
