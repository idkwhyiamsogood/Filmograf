import axios from 'axios'

export const serverLink = 'https://api.kinopoisk.dev/v1.4'

const axiosInstance = axios.create({
	baseURL: `${serverLink}`,
	headers: {
		'Content-Type': 'application/json',
		'X-API-KEY': "9HQKXZF-H42MWWC-MZJWJVV-43WKGAC",
	},
})

export default axiosInstance