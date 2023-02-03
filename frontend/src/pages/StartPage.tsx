import React from "react";
import {Button} from "@mantine/core";
import axios from "axios";
import {useNavigate} from "react-router-dom"


export function StartPage() {
    const navigate = useNavigate()
    
    //TODO: flytt til header komponent
    const logOut = async () => {
		await axios
			.post('/auth/logout')
			.then(() => {
				navigate('/')
			})
			.catch((err) => {
				console.log('Something went wrong while logging out')
				console.log(err)
				navigate('/')
			})
	}

    return (
        <>
            <p>Start page</p>
            
            <Button
            uppercase
            type="submit"
            onClick={logOut}
        >
            Log Out
            </Button>
        </>
        
    )
}