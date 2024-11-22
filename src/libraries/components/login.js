const createLogin = (token, idName, idPassword, loginButtonId, privateId, loginId) => {
    const inputName = document.querySelector(idName);
    const inputPassword = document.querySelector(idPassword);
    const loginButton = document.querySelector(loginButtonId);
    const divPrivate = document.querySelector(privateId);
    const divLogin = document.querySelector(loginId);

    divLogin.classList.add(".visible");
    divLogin.classList.remove(".hidden");
    divPrivate.classList.remove(".visible");
    divPrivate.classList.add(".hidden");
    isLogged = sessionStorage.getItem("Logged") || false;

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            fetch("http://ws.cipiaceinfo.it/credential/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "key": token
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                .then(r => r.json())
                .then(r => {
                    resolve(r.result);
                })
                .catch(reject);
        });
    }

    loginButton.onclick = () => {
        login(inputName.value, inputPassword.password).then((result) => {
            if (result) {
                isLogged = true;
                sessionStorage.setItem("Logged", true);
                divLogin.classList.remove(".visible");
                divLogin.classList.add(".hidden");
                divPrivate.classList.add(".visible");
                divPrivate.classList.remove(".hidden");
            }
        });
    }

    return {
        isLogged: () => isLogged
    }
}

export { createLogin }

