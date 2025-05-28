# Configuração do Deploy para Google Cloud Run

Este documento descreve como configurar o deploy automático para o Google Cloud Run através do GitHub Actions quando uma nova tag é criada.

## Configuração dos Secrets no GitHub

Para que o workflow de deploy funcione corretamente, você precisa configurar os seguintes secrets no seu repositório GitHub:

### Credenciais do Google Cloud

- `GCP_SA_KEY_PROD`: Chave de conta de serviço do Google Cloud em formato JSON para o ambiente de produção.

### Configurações do Banco de Dados

- `DB_HOST_PROD`: Host do banco de dados PostgreSQL de produção
- `DB_PORT_PROD`: Porta do banco de dados PostgreSQL de produção
- `DB_USERNAME_PROD`: Nome de usuário do banco de dados PostgreSQL de produção
- `DB_PASSWORD_PROD`: Senha do banco de dados PostgreSQL de produção
- `DB_DATABASE_PROD`: Nome do banco de dados PostgreSQL de produção

### Configurações da Aplicação

- `JWT_SECRET_PROD`: Chave secreta para geração de tokens JWT no ambiente de produção
- `CORS_ORIGIN_PROD`: Lista de origens permitidas para CORS (separadas por vírgula)

## Como configurar os secrets no GitHub

1. Acesse seu repositório no GitHub
2. Vá para "Settings" > "Secrets and variables" > "Actions"
3. Clique em "New repository secret"
4. Adicione cada um dos secrets listados acima com seus respectivos valores

## Como obter a chave de serviço do Google Cloud

1. Acesse o Console do Google Cloud
2. Vá para "IAM & Admin" > "Service Accounts"
3. Crie uma nova conta de serviço ou selecione uma existente
4. Conceda as permissões necessárias (Cloud Run Admin, Storage Admin, etc.)
5. Crie uma nova chave para a conta de serviço em formato JSON
6. Copie todo o conteúdo do arquivo JSON e adicione como o valor do secret `GCP_SA_KEY_PROD`

## Configuração do Repositório no Google Cloud

Antes de executar o workflow, você precisa criar um repositório no Artifact Registry do Google Cloud:

```bash
# Ativar o serviço Artifact Registry
gcloud services enable artifactregistry.googleapis.com

# Criar o repositório Docker
gcloud artifacts repositories create ritmo-api-prod \
    --repository-format=docker \
    --location=us-central1 \
    --description="Repositório Docker para a API Ritmo em produção"
```

## Configuração do Serviço Cloud Run

O workflow irá criar ou atualizar um serviço Cloud Run chamado `ritmo-api-prod`. Certifique-se de que a conta de serviço utilizada tenha as permissões necessárias para criar e gerenciar serviços Cloud Run.

## Como criar tags e acionar o deploy

O deploy é acionado automaticamente quando uma nova tag com prefixo 'v' é criada. Para criar uma nova tag e acionar o deploy, siga os passos abaixo:

### Usando o script de release

O projeto já possui scripts de release configurados no package.json. Você pode usar um dos seguintes comandos:

```bash
# Para uma versão major (1.0.0 -> 2.0.0)
npm run release:major

# Para uma versão minor (1.0.0 -> 1.1.0)
npm run release:minor

# Para uma versão patch (1.0.0 -> 1.0.1)
npm run release:patch
```

### Manualmente via Git

Alternativamente, você pode criar tags manualmente:

```bash
# Criar uma tag localmente
git tag v1.0.0

# Enviar a tag para o repositório remoto
git push origin v1.0.0
```

Assim que a tag for enviada para o repositório, o GitHub Actions irá automaticamente iniciar o workflow de deploy para o Cloud Run.

### Versão da imagem

A versão da tag (sem o prefixo 'v') será usada como tag da imagem Docker. Por exemplo, se você criar a tag `v1.2.3`, a imagem será publicada como:

```
us-central1-docker.pkg.dev/ritmo-app-prod/ritmo-api-prod/api:1.2.3
```

Além disso, a imagem também será publicada com a tag `latest`.
