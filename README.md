<h1 align="center">
  <img alt="Fastfeet" src="https://github.com/Rocketseat/bootcamp-gostack-desafio-02/blob/master/.github/logo.png" width="300px" />
</h1>


<p align="center">
  <a href="#sobre-o-projeto">Sobre o projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#ferramentas-utilizadas">Ferramentas utilizadas</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#funcionalidades-da-aplicação">Funcionalidades</a>
</p>

Este projeto é dedicado à construção da aplicação FastFeet que será utilizada como avalição no Bootcamp GoStack da Rocketseat


## Sobre o projeto

Este projeto é uma aplicação completa (Back-end, Front-end e Mobile), que consiste em criar um sistema para uma transportadora fictícia.


## Ferramentas utilizadas

Algumas das ferramentas utilizadas para o desenvolvimento deste projeto são:
- Express;
- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (Utilizando PostgreSQL);
- Docker
- JWT + Bcrypt

## Funcionalidades da aplicação

***1. Gestão de usuários*** - Esta funcionalidade é responsável por cadastrar os usuários que terão acesso ao sistema (administradores).

***2. Autenticação de usuários*** - Esta funcionalidade é responsável por autenticar o acesso dos usuários cadastrados para que estes possam ter acesso às funcionalidades da aplicação como, cadastro de funcionários, cadastro de destinatários, cadastro de encomendas, entre outras.

***3. Cadastro e edição de destinatários*** - Esta funcionalidade permite cadastrar e editar destinatários da transportadora. Esta funcionalidade é acessível apenas para usuários que estejam autenticados no sistema.

***4. Gestão de entregadores*** - Esta funcionalidade é responsável por cadastrar, listar, atualizar e remover entregadores da transportadora.

***5. Gestão de encomendas*** - Esta funcionalidade é disponível para usuários autenticados na aplicação (administradores) e permite o cadastro de encomendas, associando estas encomendas a um destinatário e a um entregador. 
Esta funcionalidade possui algumas regras de negócio:
 - Sempre que uma nova encomenda é registrada o entregador responsável por esta é notificado por e-mail.
 - O entregador deve informar o horário de retirada da encomenda para entrega, não podendo retirar antes das 08:00 horas ou após as 18:00 horas e não podendo retirar mais de 5 encomendas por dia.
 - O entregador é capaz de registrar problemas com a entrega, listar todas as encomendas com problemas e verificar os problemas com uma entrega específica.
 - O entregador é capaz de visualizar todas as encomendas atribuídas à ele e as encomendas já entregues por ele.
 - Os administradores podem cancelar a entrega de uma encomenda de acordo com a gravidade do problema registrado e quando isto ocorrer o entregador responsável deve ser notificado por e-mail.
 - O entregador deve informar o horário de entrega da encomenda e enviar um arquivo de imagem com a assinatura do destinatário no momento da entrega.

