#!/bin/bash

# Cores para mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sem cor

echo -e "${YELLOW}Configurando PostgreSQL para o projeto Ponto${NC}"
echo "-------------------------------------------"

# Verificar se o PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL não está instalado. Por favor, instale o PostgreSQL primeiro.${NC}"
    echo "Você pode instalar com: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Definir variáveis do banco de dados
DB_NAME="ponto_db"
DB_USER="postgres"
DB_PASSWORD="postgres"

echo -e "${YELLOW}Criando banco de dados '${DB_NAME}'...${NC}"

# Tentar criar o banco de dados
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};" 2>/dev/null || echo -e "${YELLOW}Banco de dados já existe ou não foi possível criar.${NC}"

echo -e "${YELLOW}Executando migrations...${NC}"
pnpm run migration:run || npm run migration:run

echo -e "${YELLOW}Populando banco de dados com dados iniciais...${NC}"
pnpm run db:seed || npm run db:seed

echo -e "${GREEN}Configuração concluída!${NC}"
echo -e "${GREEN}O banco de dados PostgreSQL '${DB_NAME}' está pronto para uso.${NC}"
echo -e "${YELLOW}Credenciais de acesso ao sistema:${NC}"
echo "Email: admin@exemplo.com"
echo "Senha: 123456"
