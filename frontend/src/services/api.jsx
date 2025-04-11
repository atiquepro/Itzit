export const logout = async() => {
    await fetch('http://localhost:5000/api/logout', {
        method: 'POST'
    })

    window.location.href = '/login'
}