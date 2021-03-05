const {SERVER_BASE_URL} = require('../../config/env.config');

module.exports = {
  getHTML(token) {
    if (!token) return;
    return `
      <div>
        <h6>Cadastro efetuado com sucesso, valide seu email abaixo.</h6>
        <button>
          <a href="${SERVER_BASE_URL}/user/validate-email?t=${token}">Validar Email</a>
        </button>
      </div>`
  }
}

