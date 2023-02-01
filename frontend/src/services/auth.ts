import axios from 'axios';

export const verifyToken = () => {
	return axios.post('/auth/verify/')
}

export const login = (phone_number: string, password: string) => {
    return axios.post('/auth/', {
		phone_number: phone_number,
		password: password,
	})
}