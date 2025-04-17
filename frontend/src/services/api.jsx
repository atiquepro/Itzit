import axios from "axios"

export const logout = async() => {
    await axios.post('http://localhost:5000/api/logout', {
        method: 'POST'
    })

    window.location.href = '/login'
}