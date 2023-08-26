.DEFAULT_GOAL := help
.PHONY: help
MAKEFLAGS += -j2

help: ## 🛟 Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-7s\033[0m %s\n", $$1, $$2}'

doc: ## 📚 Serve documentation on localhost
	npx -p docsify-cli docsify serve ./docs

setup_submodules: ## 📦 Setup the submodules
	rm -rf admin/zencode/zenflows-crypto
	rm -rf webapp/zenflows-crypto
	cd admin && git submodule add -f https://github.com/interfacerproject/zenflows-crypto zencode/zenflows-crypto
	cd webapp && git submodule add -f https://github.com/interfacerproject/zenflows-crypto zenflows-crypto

setup: ## ⛏️ Setup the project
	git init
	rm -rf admin/zencode/zenflows-crypto
	rm -rf webapp/zenflows-crypto
	cd admin && git submodule add -f https://github.com/interfacerproject/zenflows-crypto zencode/zenflows-crypto
	cd webapp && git submodule add -f https://github.com/interfacerproject/zenflows-crypto zenflows-crypto

bg:
	@echo "🚀 Launching the Backend" 
	cd admin && ./setup
	./admin/pb serve

fgdev:
	@echo "🚀 watch the frontend " 
	cd webapp && pnpm dev

fg:
	@echo "🚀 Launching the Frontend" 
	if [ ! -f ./webapp/.env ]; then \
		cp ./webapp/.env.example ./webapp/.env; \
	fi
	cd webapp && pnpm i && pnpm serve

purge: ##  Purge the data
	@echo "⛔ Purge the data"
	rm -fr admin/pb_data/*

clean: ## 🧹 Clean the project builds
	@echo "🧹 Cleaning project build"
	rm -f admin/pb
	rm -fr webapp/node_modules
	rm -f webapp/src/lib/pocketbase-types.ts
	rm -f webapp/src/lib/schema/pb_schema.json

up: bg fg ## 💄 Run all the components quickly
dev: bg fgdev ## 👩‍💻Run all the components in dev mode
