/// <reference types="cypress" />

describe('Login - Teste da API ServeRest', () => {

    it('Deve fazer login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: "http://localhost:3000/login",
            body: {
                "email": "fulano@qa.com",
                "password": "teste"
            }

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)

        })
    });
});
