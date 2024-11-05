let emailInput = document.querySelector('#email-input')
let nameInput = document.querySelector('#name-input')
let passwordInput = document.querySelector('#password-input')
async function registerUser() {

    const url = 'https://todo-app-back-1.onrender.com/register'

    const dadosUsuario = {
        email: emailInput.value,
        name: nameInput.value,
        password: passwordInput.value
    }

    try {
        let register = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario)
        });
        let response = await register.json()


        //Caso o usuario seja adiciona com sucesso
        if (response.addUser) {
            localStorage.setItem('token', response.addUser.token)
            // Só redireciona o site caso o token seja enviado!
            if (response.addUser.token) {
                return location.replace('todo.html')
            }
        }


        if (response.error && response.error.email) {
            document.querySelector('#error-email').style.display = 'block';
            document.querySelector('#error-email').innerHTML = response.error.email.join(', ');
        } else {
            document.querySelector('#error-email').style.display = 'none';
        }

        if (response.error && response.error.name) {
            document.querySelector('#error-name').style.display = 'block';
            document.querySelector('#error-name').innerHTML = response.error.name.join(', ');
        } else {
            document.querySelector('#error-name').style.display = 'none';
        }

        if (response.error && response.error.password) {
            document.querySelector('#error-password').style.display = 'block';
            document.querySelector('#error-password').innerHTML = response.error.password.join(', ');
            document.querySelector('#button-cadastro').style.marginTop = '20px'
        } else {
            document.querySelector('#error-password').style.display = 'none';
            document.querySelector('#button-cadastro').style.marginTop = '0px'
        }

        if (response.error === 'Email existente') {
            document.querySelector('#error-email').innerHTML = 'Email existente!';
            document.querySelector('#error-email').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
    }

}