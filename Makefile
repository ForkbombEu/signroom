.DEFAULT_GOAL := help
.PHONY: help

ROOT_DIR	= $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
ADMIN			= $(ROOT_DIR)/admin
WEBAPP		= $(ROOT_DIR)/webapp
AZC				= $(ADMIN)/zencode/zenflows-crypto
WZC				= $(WEBAPP)/zenflows-crypto


# detect the operating system
OSFLAG 				:=
ifneq ($(OS),Windows_NT)
	UNAME_S := $(shell uname -s)
	UNAME_M := $(shell uname -m)
	ifeq ($(UNAME_S),Linux)
		OSFLAG += LINUX
	endif
	ifeq ($(UNAME_S),Darwin)
		ifeq ($(UNAME_M),arm64)
			OSFLAG += arm64
		else
			OSFLAG += OSX
		endif
	endif
endif


help: ## 🛟  Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-7s\033[0m %s\n", $$1, $$2}'

# - Setup - #

.git:
	@echo "📦 Setup Git"
	@git init -q
	@git branch -m main

$(AZC): .git
	@rm -rf $(AZC)
	@cd $(ADMIN) && git submodule --quiet add -f https://github.com/interfacerproject/zenflows-crypto zencode/zenflows-crypto

$(WZC): .git
	@rm -rf $(WZC)
	@cd $(WEBAPP) && git submodule --quiet add -f https://github.com/interfacerproject/zenflows-crypto zenflows-crypto

setup_submodules: $(AZC) $(WZC) ## 📦 Setup the submodules
	@echo "📦 Setup the submodules"

setup_zenroom: ## 📦 Setup zenroom
	@echo "📦 Setup zenroom"
	@if ! command -v zenroom &> /dev/null; then \
		echo -n "Need zenroom executables, do you want to download them (works only on Osx not arm64 and Linux)? [y/N] " && read ans && [ $${ans:-N} = y ]; \
		if [ $(OSFLAG) == "OSX" ]; then \
				wget -O /usr/local/bin/zencode-exec.command https://github.com/dyne/zenroom/releases/latest/download/zencode-exec.command; \
				wget -O /usr/local/bin/zenroom.command https://github.com/dyne/zenroom/releases/latest/download/zenroom.command; \
				ln -s /usr/local/bin/zenroom.command /usr/local/bin/zenroom; \
				ln -s /usr/local/bin/zencode-exec.command /usr/local/bin/zencode-exec; \
				chmod +x /usr/local/bin/zencode-exec; \
				chmod +x /usr/local/bin/zenroom; \
		fi; \
		if [ $(OSFLAG) == "LINUX" ]; then \
			wget -O /usr/local/bin/zencode-exec https://github.com/dyne/zenroom/releases/latest/download/zencode-exec; \
			wget -O /usr/local/bin/zenroom https://github.com/dyne/zenroom/releases/latest/download/zenroom; \
			chmod +x /usr/local/bin/zencode-exec; \
			chmod +x /usr/local/bin/zenroom; \
		fi; \
	else \
		echo "Zenroom executables already exists"; \
	fi
	@echo " "

setup_backend: ## 📦 Setup the frontend
	@echo "📦 Setup the backend"
	@if [ ! -d ./admin/pb_data ]; then \
    	mkdir ./admin/pb_data; \
	fi
	@cd admin && ./setup

	@echo " "

setup_frontend: ## 📦 Setup the frontend
	@echo "📦 Setup the frontend"
	if [ ! -f ./webapp/.env ]; then \
		cp ./webapp/.env.example ./webapp/.env; \
	fi
	cd webapp && pnpm i
	@echo " "

setup: setup_submodules setup_backend setup_zenroom setup_frontend ## 📦 Setup the project

# - Running - #

# sleep 2 is needed to wait for the admin server to start
# before the webapp tries to connect to it and generate the schema
# check the webapp/package.json for the predev and prebuild scripts

be: ## ⚙️ Run the backend
	./admin/pb serve

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

clean_submodules:
	@echo "🧹 Clean submodules"
	@rm -rf $(AZC)
	@rm -rf $(WZC)

clean_build:
	@echo "🧹 Clean project build"
	rm -f admin/pb
	rm -fr webapp/node_modules
	rm -f webapp/src/lib/pocketbase/types.ts
	rm -f webapp/src/lib/pocketbase/schema/db_schema.json
	@echo " "

clean: clean_submodules clean_build ## 🧹 Clean the project

purge: ## ⛔ Purge the database
	@echo "⛔ Purge the database"
	rm -fr admin/pb_data/*
	@echo " "
