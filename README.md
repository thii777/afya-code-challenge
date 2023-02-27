## Afya code challenge

Este projeto foi desenvolvido em NestJS com TypeORM, que é um framework Node.js para a construção de aplicativos server-side eficientes e escaláveis. Ele utiliza o TypeORM como ORM (Object-Relational Mapping) para se comunicar com o banco de dados.
### Testes automatizados.

Para rodar os testes, bastar executar o comando abaixo:

> **npm run test**

"Os testes automatizados foram desenvolvidos utilizando a ferramenta Jest, com mocks para testar apenas a camada de domínio e a service."

#### Como executar o projeto

Para executar o projeto, siga as instruções abaixo:

- Certifique-se de ter o Docker instalado em sua máquina.
- Clone o repositório do projeto em sua máquina.
- Navegue até a pasta do projeto.
- Execute o comando **docker-compose up** para iniciar o projeto.
> **docker-compose up** 
- Acesse a documentação do projeto por meio do endereço http://localhost:3000/api/documentation.

#### .env.example
Copie o arquivo .env.example, cole na raiz do projeto e renomeie para .env (com isso teremos todas as variaveis de ambiente setadas na aplicação).