# API Ponto - Documentação (BETA)

## Visão Geral

API Ponto é um sistema de gerenciamento de ponto eletrônico desenvolvido com NestJS. Esta API permite o registro, consulta e gerenciamento de pontos eletrônicos de forma eficiente e segura. O sistema inclui uma calculadora de tempo avançada que ajuda a determinar horários de saída, intervalos de almoço e horas extras com base em diferentes parâmetros de entrada.

> **Nota:** Esta API está atualmente em fase Beta e pode sofrer alterações significativas.

![Versão](https://img.shields.io/badge/versão-0.9.0--beta-orange)
![Status](https://img.shields.io/badge/status-beta-orange)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## Índice

- [API Ponto - Documentação (BETA)](#api-ponto---documentação-beta)
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
  - [Deploy no Google Cloud Run](#deploy-no-google-cloud-run)
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

## Deploy no Google Cloud Run

Este projeto está configurado para ser implantado no Google Cloud Run usando GitHub Actions. O deploy é acionado automaticamente quando uma nova tag com prefixo 'v' é criada.

### Pré-requisitos

1. Conta no Google Cloud Platform com um projeto configurado
2. Repositório no GitHub com GitHub Actions habilitado
3. Secrets configurados no GitHub para autenticação e variáveis de ambiente

### Configuração dos Secrets no GitHub

Para que o workflow de deploy funcione corretamente, você precisa configurar os seguintes secrets no seu repositório GitHub:

#### Credenciais do Google Cloud

- `GCP_SA_KEY_PROD`: Chave de conta de serviço do Google Cloud em formato JSON para o ambiente de produção.

#### Configurações do Banco de Dados

- `DB_HOST_PROD`: Host do banco de dados PostgreSQL de produção
- `DB_PORT_PROD`: Porta do banco de dados PostgreSQL de produção
- `DB_USERNAME_PROD`: Nome de usuário do banco de dados PostgreSQL de produção
- `DB_PASSWORD_PROD`: Senha do banco de dados PostgreSQL de produção
- `DB_DATABASE_PROD`: Nome do banco de dados PostgreSQL de produção

#### Configurações da Aplicação

- `JWT_SECRET_PROD`: Chave secreta para geração de tokens JWT no ambiente de produção
- `CORS_ORIGIN_PROD`: Lista de origens permitidas para CORS (separadas por vírgula)

### Como criar uma nova release e acionar o deploy

O deploy é acionado automaticamente quando uma nova tag com prefixo 'v' é criada. Para criar uma nova tag e acionar o deploy, você pode usar os scripts de release já configurados no projeto:

```bash
# Release de correção de bugs (incrementa o patch)
pnpm release:patch "Corrige bug no cálculo de horas extras"

# Release com novas funcionalidades (incrementa o minor)
pnpm release:minor "Adiciona funcionalidade de relatórios"

# Release com mudanças incompatíveis (incrementa o major)
pnpm release:major "Refatora API com nova estrutura"
```

O script de release automaticamente cria a tag e a envia para o repositório, acionando o workflow de deploy.

## Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js para construir aplicações server-side
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [PostgreSQL](https://www.postgresql.org/) - Sistema de gerenciamento de banco de dados relacional
- [TypeORM](https://typeorm.io/) - ORM para TypeScript e JavaScript
- [JWT](https://jwt.io/) - JSON Web Token para autenticação

## Fluxo de Desenvolvimento (GitFlow)

Este projeto segue o modelo GitFlow para gerenciamento de branches e releases. O GitFlow define uma estrutura de ramificação específica para facilitar o desenvolvimento colaborativo e o controle de versões.

### Estrutura de Branches

- **main**: Código estável de produção
- **develop**: Branch de integração para o próximo release
- **feature/\***: Desenvolvimento de novas funcionalidades
- **release/\***: Preparação de releases
- **hotfix/\***: Correções rápidas em produção

### Fluxo de Trabalho

#### Desenvolvimento de Funcionalidades

```bash
# Criar uma nova branch de feature
git flow feature start nome-da-feature

# Desenvolver a funcionalidade e fazer commits

# Finalizar a feature
git flow feature finish nome-da-feature
```

#### Correção de Bugs em Produção

```bash
# Criar uma nova branch de hotfix
git flow hotfix start nome-do-hotfix

# Corrigir o bug

# Finalizar o hotfix
git flow hotfix finish nome-do-hotfix
```

### Processo de Release Automatizado

O projeto conta com um script automatizado para gerenciar releases seguindo o versionamento semântico (SemVer). O script `release.sh` calcula automaticamente a próxima versão com base no tipo de release e atualiza todos os arquivos necessários.

#### Versionamento Semântico (SemVer)

O versionamento segue o padrão X.Y.Z, onde:

- **X (major)**: Mudanças incompatíveis com versões anteriores
- **Y (minor)**: Adição de funcionalidades com compatibilidade
- **Z (patch)**: Correções de bugs com compatibilidade

#### Comandos de Release

Para facilitar o processo de release, foram adicionados scripts no `package.json` que podem ser executados com pnpm:

```bash
# Release de correção de bugs (incrementa o patch)
pnpm release:patch "Corrige bug no cálculo de horas extras"

# Release com novas funcionalidades (incrementa o minor)
pnpm release:minor "Adiciona funcionalidade de relatórios"

# Release com mudanças incompatíveis (incrementa o major)
pnpm release:major "Refatora API com nova estrutura"
```

O script de release automaticamente:

1. Calcula a próxima versão com base na versão atual
2. Cria uma branch de release
3. Atualiza a versão no `package.json` e no README
4. Faz commit das alterações
5. Finaliza a release, mesclando as alterações nas branches `main` e `develop`
6. Cria uma tag para a versão

#### Enviando a Release para o Repositório Remoto

Após finalizar a release, é necessário enviar as alterações para o repositório remoto:

```bash
git push origin develop
git push origin main
git push --tags
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git flow feature start nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Finalize a feature (`git flow feature finish nova-feature`)
5. Abra um Pull Request para a branch `develop`

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
