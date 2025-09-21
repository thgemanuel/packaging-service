# Packaging Service API

API Web desenvolvida com Node.js e NestJS para otimização de empacotamento de produtos em caixas de papelão.

## Descrição do Problema

A API recebe uma lista de pedidos em formato JSON, onde cada pedido contém produtos com suas dimensões (altura, largura, comprimento). O sistema processa cada pedido e determina a melhor forma de embalar os produtos, selecionando uma ou mais caixas para cada pedido e especificando quais produtos vão em cada caixa.

## Caixas Disponíveis

O sistema trabalha com os seguintes tamanhos de caixas de papelão (altura x largura x comprimento em centímetros):

- **Caixa 1**: 30 x 40 x 80
- **Caixa 2**: 50 x 50 x 40  
- **Caixa 3**: 50 x 80 x 60

## Tecnologias Utilizadas

- **TypeScript** (ES2021 target)
- **Node.js** com **NestJS** framework
- **PostgreSQL** com **TypeORM**
- **Docker & Docker Compose** para containerização
- **Make** para automação de build
- **Jest** para testes
- **ESLint + Prettier** para qualidade de código
- **Swagger/OpenAPI** para documentação da API
- **NestJS Terminus** para health checks

## Arquitetura

O projeto segue os padrões de Clean Architecture com três camadas:

### Domain Layer (`src/domain/`)
- `entities/` - Entidades de negócio com lógica de domínio
- `repositories/` - Interfaces de repositório (contratos)
- `enums/` - Enums e constantes do domínio
- `exceptions/` - Exceções específicas do domínio
- `value-objects/` - Objetos de valor para tipos complexos
- `utils/` - Utilitários do domínio

### Application Layer (`src/application/`)
- `use-cases/` - Orquestração da lógica de negócio
- `dto/` - Data Transfer Objects com validação
- `mappers/` - Transformação de dados entre camadas
- `services/` - Serviços de aplicação

### Infrastructure Layer (`src/infrastructure/`)
- `controllers/` - Controladores HTTP e handlers de rota
- `persistence/postgres/` - Implementações de banco de dados
  - `schemas/` - Esquemas TypeORM
  - `repositories/` - Implementações de repositório
  - `migrations/` - Migrações de banco de dados
  - `mappers/` - Mapeamento domínio ↔ persistência
- `filters/` - Filtros de exceção
- `pipes/` - Pipes de validação

## Como Executar

### Pré-requisitos
- Docker e Docker Compose
- Make

### Comandos Disponíveis

```bash
# Setup inicial (cria network e copia .env)
make setup

# Build da aplicação
make build

# Executar aplicação com migrações
make run

# Executar testes
make test

# Executar migrações
make run-migrations

# Criar network Docker
make create-packaging-network

# Copiar arquivo de ambiente
make copy-env
```

### Primeira Execução

1. Clone o repositório
2. Execute a aplicação:
   ```bash
   make run
   ```

A API estará disponível em `http://localhost:3000`

## Endpoints da API

### POST /packaging/orders
Processa uma lista de pedidos e retorna o resultado do empacotamento otimizado.

**Request Body:**
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        {
          "produto_id": "PS5",
          "dimensoes": {
            "altura": 40,
            "largura": 10,
            "comprimento": 25
          }
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "caixas": [
        {
          "caixa_id": "Caixa 1",
          "produtos": ["PS5"]
        }
      ]
    }
  ]
}
```

### GET /healthcheck
Verifica o status do serviço e suas dependências.

**Response:**
```json
{
  "dependencies": [
    { "resource_type": "postgresql", "url": "/healthcheck-postgresql" }
  ]
}
```

### GET /healthcheck-postgresql
Verifica especificamente a conexão com o banco de dados PostgreSQL.

### GET /api
Acessa a documentação interativa da API via Swagger/OpenAPI.

## Algoritmo de Empacotamento

O sistema utiliza o algoritmo **First Fit Decreasing (FFD)** com otimizações:

1. **Ordenação**: Produtos são ordenados por volume (decrescente)
2. **Rotação**: Considera diferentes orientações do produto
3. **Otimização**: Minimiza o número de caixas utilizadas
4. **Eficiência**: Maximiza o aproveitamento do espaço

## Estrutura do Banco de Dados

- `products` - Produtos com dimensões
- `boxes` - Caixas disponíveis  
- `orders` - Pedidos recebidos
- `order_products` - Produtos por pedido
- `packaging_results` - Resultados de empacotamento

## Configuração do Ambiente

### Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

- `PORT` - Porta da aplicação (padrão: 3000)
- `BIND_PORT` - Porta para bind do Docker (padrão: 3000)
- `BIND_DB_PORT` - Porta do banco de dados (padrão: 5432)
- `SERVICE_COMMAND` - Comando para execução do serviço

### Docker Network

O serviço utiliza uma network Docker personalizada chamada `packaging` para comunicação entre containers.

## Desenvolvimento

### Padrões de Código
- Use kebab-case para nomes de arquivos
- Use PascalCase para classes, interfaces, enums
- Use camelCase para métodos, propriedades, variáveis
- Use UPPER_SNAKE_CASE para constantes

### Testes
- Testes unitários: Co-localizados com arquivos fonte (`.spec.ts`)
- Testes de integração: Diretório `test/`
- Execute `make test` após mudanças
- Configuração Jest personalizada em `src/jest-units.json`

### Scripts NPM Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Modo desenvolvimento com hot reload
npm run start:debug        # Modo debug com hot reload
npm run start:prod         # Modo produção

# Build e Testes
npm run build              # Build da aplicação
npm run test               # Executar testes unitários
npm run test:watch         # Executar testes em modo watch
npm run test:cov           # Executar testes com coverage

# Qualidade de Código
npm run lint               # Executar ESLint com auto-fix
npm run format             # Formatar código com Prettier

# Banco de Dados
npm run typeorm:run-migrations     # Executar migrações
npm run typeorm:generate-migration # Gerar nova migração
npm run typeorm:revert-migration   # Reverter última migração
```

### Linting
**OBRIGATÓRIO**: Execute `npm run lint` após cada mudança significativa no código.

## Dependências Principais

### Produção
- `@nestjs/common` - Framework NestJS
- `@nestjs/typeorm` - Integração TypeORM
- `@nestjs/swagger` - Documentação OpenAPI
- `@nestjs/terminus` - Health checks
- `typeorm` - ORM para PostgreSQL
- `pg` - Driver PostgreSQL
- `class-validator` - Validação de DTOs
- `class-transformer` - Transformação de dados
- `uuid` - Geração de UUIDs

### Desenvolvimento
- `@nestjs/cli` - CLI do NestJS
- `typescript` - Compilador TypeScript
- `jest` - Framework de testes
- `eslint` - Linter
- `prettier` - Formatador de código
- `ts-jest` - Integração Jest com TypeScript

## Licença

**Desenvolvido por:** [@thgemanuel](https://github.com/thgemanuel)

MIT License - Projeto público

Copyright (c) 2025 Packaging Service

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.