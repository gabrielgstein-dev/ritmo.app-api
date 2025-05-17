#!/bin/bash

# Script para automatizar o processo de release usando GitFlow
# Calcula automaticamente a próxima versão com base no tipo de release

# Função para incrementar a versão
increment_version() {
  local version=$1
  local release_type=$2
  
  # Separa a versão em major, minor e patch
  local major=$(echo $version | cut -d. -f1)
  local minor=$(echo $version | cut -d. -f2)
  local patch=$(echo $version | cut -d. -f3)
  
  case $release_type in
    major)
      major=$((major + 1))
      minor=0
      patch=0
      ;;
    minor)
      minor=$((minor + 1))
      patch=0
      ;;
    patch)
      patch=$((patch + 1))
      ;;
    *)
      echo "Tipo de release inválido: $release_type"
      exit 1
      ;;
  esac
  
  echo "$major.$minor.$patch"
}

# Obtém o tipo de release (major, minor, patch)
if [ -z "$1" ]; then
  echo "Erro: Tipo de release não fornecido"
  echo "Uso: ./release.sh <tipo> [mensagem]"
  echo "Tipos: major, minor, patch"
  echo "Exemplo: ./release.sh minor 'Adiciona funcionalidade X'"
  exit 1
fi

RELEASE_TYPE=$1

# Verifica se o tipo de release é válido
if [[ "$RELEASE_TYPE" != "major" && "$RELEASE_TYPE" != "minor" && "$RELEASE_TYPE" != "patch" ]]; then
  echo "Erro: Tipo de release inválido: $RELEASE_TYPE"
  echo "Tipos válidos: major, minor, patch"
  exit 1
fi

# Obtém a versão atual do package.json
CURRENT_VERSION=$(grep '"version":' package.json | cut -d '"' -f4)

# Calcula a próxima versão
NEXT_VERSION=$(increment_version $CURRENT_VERSION $RELEASE_TYPE)

# Mensagem de release padrão ou personalizada
if [ -z "$2" ]; then
  MESSAGE="Release versão $NEXT_VERSION"
else
  MESSAGE="$2"
fi

echo "Iniciando processo de release para a versão $VERSION..."

# Verifica se estamos na branch develop
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
  echo "Erro: Você deve estar na branch 'develop' para iniciar uma release"
  echo "Branch atual: $CURRENT_BRANCH"
  echo "Execute: git checkout develop"
  exit 1
fi

# Verifica se há alterações não commitadas
if [ -n "$(git status --porcelain)" ]; then
  echo "Erro: Existem alterações não commitadas no repositório"
  echo "Faça commit ou stash das alterações antes de iniciar uma release"
  exit 1
fi

# Verifica se o git-flow está instalado
if ! command -v git flow &> /dev/null; then
  echo "Erro: git-flow não está instalado"
  echo "Instale com: sudo apt-get install git-flow"
  exit 1
fi

# Inicia a release
echo "Criando branch de release $NEXT_VERSION..."
git flow release start $NEXT_VERSION

# Atualiza a versão no package.json
echo "Atualizando versão no package.json..."
sed -i "s/\"version\": \".*\"/\"version\": \"$NEXT_VERSION\"/" package.json

# Atualiza a versão no README.md (exemplo de configuração do Swagger)
echo "Atualizando versão no README.md..."
sed -i "s/\.setVersion('[^']*')/\.setVersion('$NEXT_VERSION')/" README.md

# Faz commit das alterações de versão
echo "Commitando alterações de versão..."
git add package.json README.md
git commit -m "chore: atualiza versão para $NEXT_VERSION"

# Finaliza a release
echo "Finalizando release $NEXT_VERSION..."
git flow release finish -m "$MESSAGE" $NEXT_VERSION

# Verifica se a finalização da release foi bem-sucedida
if [ $? -ne 0 ]; then
  echo "Erro ao finalizar a release. Verifique as mensagens acima."
  exit 1
fi

echo "Release $NEXT_VERSION concluída com sucesso!"
echo "Branch atual: $(git branch --show-current)"
echo ""
echo "Para enviar as alterações para o repositório remoto, execute:"
echo "git push origin develop"
echo "git push origin main"
echo "git push --tags"

# Adiciona informações sobre o versionamento semântico
echo ""
echo "Informações sobre versionamento semântico:"
echo "  - major: Mudanças incompatíveis com versões anteriores"
echo "  - minor: Adição de funcionalidades com compatibilidade"
echo "  - patch: Correções de bugs com compatibilidade"

# Torna o script executável
chmod +x "$0"
