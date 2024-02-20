.DEFAULT_GOAL := help
.PHONY: help

ROOT_DIR	= $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
ADMIN			= $(ROOT_DIR)/admin
WEBAPP		= $(ROOT_DIR)/webapp
AZC				= $(ADMIN)/zencode/zenflows-crypto
WZC				= $(WEBAPP)/zenflows-crypto
BIN				= $(ROOT_DIR)/.bin
ZENROOM		= $(BIN)/zenroom
ZENCODE		= $(BIN)/zencode-exec
PB				= $(ADMIN)/pb
DATA			= $(ADMIN)/pb_data

export PATH := $(BIN):$(PATH)

DEPS = pnpm git wget go npx
K := $(foreach exec,$(DEPS),\
        $(if $(shell which $(exec)),some string,$(error "🥶 `$(exec)` not found in PATH please install it")))

# detect the operating system
OSFLAG 				:=
ifneq ($(OS),Windows_NT)
	UNAME_S := $(shell uname -s)
	UNAME_M := $(shell uname -m)
	ifeq ($(UNAME_S),Linux)
		OSFLAG += LINUX
		ZENROOM_URL = https://github.com/dyne/zenroom/releases/latest/download/zenroom
		ZENCODE_URL = https://github.com/dyne/zenroom/releases/latest/download/zencode-exec
	endif
	ifeq ($(UNAME_S),Darwin)
		ifeq ($(UNAME_M),arm64)
			OSFLAG += arm64
		else
			OSFLAG += OSX
			ZENROOM_URL = https://github.com/dyne/zenroom/releases/latest/download/zenroom.command
			ZENCODE_URL = https://github.com/dyne/zenroom/releases/latest/download/zencode-exec.command
		endif
	endif
endif

help: ## 🛟  Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf " \033[36m⦿ %-7s\033[0m %s\n\n", $$1, $$2}'

# - Setup - #

$(BIN):
	@mkdir $(BIN)

$(ZENROOM): | $(BIN)
	@wget -q -O $@ $(ZENROOM_URL)
	@chmod +x $@
	@echo "zenroom 😎 installed"

$(ZENCODE): | $(BIN)
	@wget -q -O $@ $(ZENCODE_URL) 
	@chmod +x $@
	@echo "zencode-exec 🤭 installed"

.git:
	@echo "🌱 Setup Git"
	@git init -q
	@git branch -m main
	@git add .

$(AZC): .git
	@rm -rf $@
	@cd $(ADMIN) && git submodule --quiet add -f https://github.com/interfacerproject/zenflows-crypto zencode/zenflows-crypto

$(WZC): .git
	@rm -rf $@
	@cd $(WEBAPP) && git submodule --quiet add -f https://github.com/interfacerproject/zenflows-crypto zenflows-crypto

$(DATA):
	mkdir -p $(DATA)

$(PB): $(DATA)
	@echo "📦 Setup the backend"
	@cd $(ADMIN) && go mod tidy && go build

$(WEBAPP)/.env:
	@cp $(WEBAPP)/.env.example $(WEBAPP)/.env

setup_frontend: $(WEBAPP)/.env
	@echo "📦 Setup the frontend"
	cd $(WEBAPP) && pnpm i

setup: $(AZC) $(WZC) $(ZENROOM) $(ZENCODE) $(PB) setup_frontend ## 📦 Setup the project
setup_arm: $(AZC) $(WZC) $(PB) setup_frontend

# - Running - #

# sleep 2 is needed to wait for the admin server to start
# before the webapp tries to connect to it and generate the schema
# check the webapp/package.json for the predev and prebuild scripts

be: ## ⚙️ Run the backend
	$(PB) serve

fe: ## ⚙️ Run the frontend
	sleep 2 && cd webapp && pnpm serve

fe_dev: ## ⚙️ Watch the frontend
	sleep 2 && cd webapp && pnpm dev

dev: ## ⚙️ Run the project in development mode
	$(MAKE) be fe_dev -j2

up: setup ## 💄 Run the project
	$(MAKE) be fe -j2

doc: ## 📚 Serve documentation on localhost
	npx -p docsify-cli docsify serve ./docs

definitions: ## ⚙️ Generate type definitions and schema
	cd webapp && pnpm definitions

# - Cleaning - #

remove_git: ## 🧹 Remove git
	@echo "🧹 Removing git"
	rm -rf .git
	@echo " "

clean: ## 🧹 Clean the project
	@echo "🧹 Clean submodules"
	@rm -rf admin/zencode/zenflows-crypto
	@rm -rf webapp/zenflows-crypto
	@echo "🧹 Clean project build"
	@rm -f admin/pb
	@rm -fr webapp/node_modules
	@rm -f webapp/src/lib/pocketbase/types.ts
	@rm -f webapp/src/lib/pocketbase/schema/db_schema.json

purge: ## ⛔ Purge the database
	@echo "⛔ Purge the database"
	rm -fr admin/pb_data/*
	@echo " "
