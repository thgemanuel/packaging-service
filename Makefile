PACKAGING_NETWORK=packaging
SERVICE_NAME=packaging-service

run: build run-migrations
	@echo 'Executando a aplicação em modo watch'
	@SERVICE_COMMAND="npm run start:dev" docker compose up --remove-orphans -d

build: setup
	@echo 'Executando build da aplicação'
	@docker compose build --pull

test: setup
	@docker compose run --rm $(SERVICE_NAME) npm run test

create-packaging-network:
ifeq (,$(shell docker network ls -q --filter name=$(PACKAGING_NETWORK)))
	@docker network create $(PACKAGING_NETWORK)
else
	@echo "Network já configurada"
endif

copy-env:
ifeq (,$(wildcard .env))
	@echo "Variáveis de ambiente aplicadas"
	@cp .env.sample .env
else
	@echo "Já existem variáveis de ambiente"
endif

run-migrations:
	@docker compose run --rm $(SERVICE_NAME) npm run typeorm:run-migrations

setup: copy-env create-packaging-network