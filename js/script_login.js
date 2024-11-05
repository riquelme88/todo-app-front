let emailInput = document.querySelector('#email-input')
let passwordInput = document.querySelector('#password-input')
let error = document.querySelectorAll('.error')


async function loginUser() {
    const url = "https://todo-app-back-1.onrender.com/login"
    const dadosDoUsuario = {
        email: emailInput.value,
        password: passwordInput.value
    }

    try {
        const login = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDoUsuario)
        });

        const response = await login.json()

        if (response.user && response.token) {
            if (response.token) {
                localStorage.setItem('token', response.token)
                location.replace('todo.html')
            }
        }
        //Gestões de erros
        if (response.error && response.error.email) {
            error[0].style.display = 'block'
            error[0].innerHTML = response.error.email
            return
        } else {
            error[0].style.display = 'none'
        }
        if (response.error && response.error.password) {
            error[1].style.display = 'block'
            error[1].innerHTML = response.error.password
            document.querySelector('#button-login').style.marginTop = '15px'
            return
        } else {
            error[1].style.display = 'none'
            document.querySelector('#button-login').style.marginTop = '0px'
        }
        if (response.error) {
            error.forEach(item => {
                item.style.display = 'block'
                item.innerHTML = response.error
            })
        }

    } catch (error) {
        if (error) {
            console.error(error)
        }
    }
}