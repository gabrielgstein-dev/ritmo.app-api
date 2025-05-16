# API Ponto - Documentação

## Visão Geral

API Ponto é um sistema de gerenciamento de ponto eletrônico desenvolvido com NestJS. Esta API permite o registro, consulta e gerenciamento de pontos eletrônicos de forma eficiente e segura. O sistema inclui uma calculadora de tempo avançada que ajuda a determinar horários de saída, intervalos de almoço e horas extras com base em diferentes parâmetros de entrada.

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## Índice

- [API Ponto - Documentação](#api-ponto---documentação)
  - [Visão Geral](#visão-geral)
  - [Índice](#índice)
  - [Requisitos](#requisitos)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
  - [Configuração Adicional](#configuração-adicional)
    - [Instalando o Swagger para Documentação da API](#instalando-o-swagger-para-documentação-da-api)
  - [Executando a Aplicação](#executando-a-aplicação)
  - [Endpoints da API](#endpoints-da-api)
    - [Endpoints de Autenticação](#endpoints-de-autenticação)
    - [Usuários](#usuários)
    - [Registros de Ponto](#registros-de-ponto)
    - [Calculadora de Tempo](#calculadora-de-tempo)
  - [Autenticação](#autenticação)
  - [Modelos de Dados](#modelos-de-dados)
    - [Modelo de Usuário](#modelo-de-usuário)
    - [Modelo de Registro de Ponto](#modelo-de-registro-de-ponto)
    - [Modelos da Calculadora de Tempo](#modelos-da-calculadora-de-tempo)
      - [Calcular Horário de Saída](#calcular-horário-de-saída)
      - [Calcular Horas Extras](#calcular-horas-extras)
  - [Testes](#testes)
  - [Deploy no Render](#deploy-no-render)
  - [Tecnologias](#tecnologias)
  - [Contribuição](#contribuição)
  - [Licença](#licença)

## Requisitos

- Node.js (v14 ou superior)
- PNPM (v7 ou superior)
- PostgreSQL (opcional, dependendo da configuração)

## Instalação

Este projeto utiliza pnpm como gerenciador de pacotes.

```bash
# Instalar pnpm globalmente (se ainda não tiver)
$ npm install -g pnpm

# Clonar o repositório
$ git clone https://github.com/seu-usuario/ponto-api.git
$ cd ponto-api

# Instalar dependências
$ pnpm install
```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`:

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/ponto_db

# CORS
CORS_ORIGIN=http://localhost:3000
```

1. Configure as variáveis de ambiente de acordo com seu ambiente de desenvolvimento.

## Configuração Adicional

### Instalando o Swagger para Documentação da API

Para adicionar documentação interativa à API usando Swagger:

1. Instale as dependências necessárias:

```bash
pnpm add @nestjs/swagger swagger-ui-express
```

1. Configure o Swagger no arquivo `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API Ponto')
    .setDescription('API para gerenciamento de ponto eletrônico')
    .setVersion('1.1.0')
    .addTag('ponto')
    .addTag('time-calculator')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configuração do CORS para permitir acesso do frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Porta definida pelo ambiente ou padrão 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`Documentação disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();
```

1. Adicione decoradores nos DTOs e controladores para melhorar a documentação. Exemplo:

```typescript
import { ApiProperty, ApiTags } from '@nestjs/swagger';

class CalculateExitTimeDto {
  @ApiProperty({ example: '08:00', description: 'Horário de entrada (formato HH:MM)' })
  entryTime: string;
}

@ApiTags('time-calculator')
@Controller('time-calculator')
export class TimeCalculatorController {
  // ... implementação do controlador
}
```

## Executando a Aplicação

```bash
# Desenvolvimento
$ pnpm start

# Modo de observação (watch mode)
$ pnpm start:dev

# Modo de produção
$ pnpm start:prod
```

## Endpoints da API

A API oferece os seguintes endpoints principais:

### Endpoints de Autenticação

- `POST /auth/login` - Autenticar usuário
- `POST /auth/register` - Registrar novo usuário

### Usuários

- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Obter detalhes de um usuário
- `PUT /users/:id` - Atualizar um usuário
- `DELETE /users/:id` - Remover um usuário

### Registros de Ponto

- `POST /pontos` - Registrar um novo ponto
- `GET /pontos` - Listar todos os pontos
- `GET /pontos/:id` - Obter detalhes de um registro de ponto
- `PUT /pontos/:id` - Atualizar um registro de ponto
- `DELETE /pontos/:id` - Remover um registro de ponto

### Calculadora de Tempo

- `POST /time-calculator/exit-time` - Calcula o horário de saída com base no horário de entrada
- `POST /time-calculator/lunch-return-time` - Calcula o horário de retorno do almoço
- `POST /time-calculator/exit-time-with-lunch` - Calcula o horário de saída considerando o intervalo de almoço
- `POST /time-calculator/extra-hours` - Calcula as horas extras trabalhadas

Para uma documentação completa dos endpoints, você pode implementar o Swagger seguindo as instruções na seção de configuração adicional.

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, é necessário incluir o token no cabeçalho da requisição:

```http
Authorization: Bearer {seu_token_jwt}
```

## Modelos de Dados

### Modelo de Usuário

```json
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "cargo": "string",
  "departamento": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Modelo de Registro de Ponto

```json
{
  "id": "uuid",
  "userId": "uuid",
  "tipo": "ENTRADA | SAIDA",
  "dataHora": "datetime",
  "localizacao": {
    "latitude": "number",
    "longitude": "number"
  },
  "observacao": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Modelos da Calculadora de Tempo

#### Calcular Horário de Saída

**Requisição:**

```json
{
  "entryTime": "08:00",
  "options": {
    "standardWorkHours": 8,
    "standardLunchBreak": 1
  }
}
```

**Resposta:**

```json
{
  "result": {
    "hours": 16,
    "minutes": 0,
    "formattedTime": "16:00"
  }
}
```

#### Calcular Horas Extras

**Requisição:**

```json
{
  "entryTime": "08:00",
  "lunchTime": "12:00",
  "returnTime": "13:00",
  "exitTime": "18:00",
  "returnToWorkTime": "19:00",
  "finalExitTime": "21:00",
  "options": {
    "standardWorkHours": 8
  }
}
```

**Resposta:**

```json
{
  "result": {
    "extraHours": 2,
    "extraMinutes": 0,
    "formattedTime": "02:00",
    "isExtra": true
  }
}
```

## Testes

```bash
# Testes unitários
$ pnpm test

# Testes e2e
$ pnpm test:e2e

# Cobertura de testes
$ pnpm test:cov
```

## Deploy no Render

Este projeto está configurado para ser facilmente implantado no Render usando pnpm. Siga os passos abaixo:

1. Crie uma conta no [Render](https://render.com) se ainda não tiver uma
2. No Dashboard do Render, clique em "New" e selecione "Web Service"
3. Conecte seu repositório GitHub/GitLab/Bitbucket
4. Configure o serviço:
   - **Nome**: Escolha um nome para seu serviço (ex: ponto-backend)
   - **Região**: Selecione a região mais próxima dos seus usuários
   - **Branch**: Selecione a branch principal (main/master)
   - **Runtime**: Node
   - **Build Command**: `npm install -g pnpm && pnpm install && pnpm build`
   - **Start Command**: `pnpm start:prod`
5. Configure as variáveis de ambiente:
   - `NODE_ENV`: production
   - `PORT`: 10000 (o Render usará esta porta internamente)
   - `CORS_ORIGIN`: URL do seu frontend (ex: "https://ponto-frontend.onrender.com")
   - Adicione outras variáveis necessárias como conexão com banco de dados
6. Clique em "Create Web Service"

O arquivo `render.yaml` na raiz do projeto já contém as configurações necessárias para o deploy automático usando pnpm.

## Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js para construir aplicações server-side
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [PostgreSQL](https://www.postgresql.org/) - Sistema de gerenciamento de banco de dados relacional
- [TypeORM](https://typeorm.io/) - ORM para TypeScript e JavaScript
- [JWT](https://jwt.io/) - JSON Web Token para autenticação

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
