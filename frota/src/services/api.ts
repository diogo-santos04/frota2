import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.by.dev.br/api/'
})

export { api }
