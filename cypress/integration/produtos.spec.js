/// <reference types="cypress"/>

import contrato from '../contracts/produtos.contract'


describe('Testes da Funcionalidade Produtos', () => {

    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve VALIDAR contrato de produtos', () => {

        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })

        
    });

    it('Listar Produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos',
        }).then((response) => {
            //expect(response.body.produtos[1].nome).to.equal('Logitech MX Vertical')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })

    });

    it('Deve CADATRAR Produtos', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000000)}`
        cy.request({
            method: 'POST',
            url: 'produtos',
            headers: { authorization: token },
            body: {
                "nome": produto,
                "preco": 375,
                "descricao": "Produto Novo",
                "quantidade": 275
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "produto EBAC Novo 1", 260, "Descrição do produto novo", 175)
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    });

    it('Deve EDITAR produto previamente cadastrado', () => {
        cy.request('produtos').then(response => {
            //cy.log(response.body.produtos[0]._id)
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body:
                {
                    "nome": "Produto EBAC 9575975009/123",
                    "preco": 150,
                    "descricao": "Produto Editado 1",
                    "quantidade": 136
                }
            }).then(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
    });

    it('Deve EDITAR produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000000)}`
        cy.cadastrarProduto(token, produto, 260, "Descrição do produto novo", 175)
            .then((response) => {
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            })

            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'PUT',
                    url: `produtos/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                        "nome": produto,
                        "preco": 200,
                        "descricao": "Produto Editado 2",
                        "quantidade": 360
                    }
                }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal("Registro alterado com sucesso")
                })
            })
    });

    it('Deve DELETAR produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000000)}`
        cy.cadastrarProduto(token, produto, 260, "Descrição do produto novo", 175)
            .then((response) => {
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            })
            .then(response=>{
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `produtos/${id}`,
                    headers: {authorization: token}
                }).then(response =>{
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal("Registro excluído com sucesso")
                })
            })
        
    });



});
