.DEFAULT_GOAL := help
.PHONY: help
MAKEFLAGS += -j2

help: ## 🛟 Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-7s\033[0m %s\n", $$1, $$2}'

doc: ## 📚 Serve documentation on localhost
	npx -p docsify-cli docsify serve ./docs

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

clean: ## 🧹 Clean the containers
	@echo "🧹 Cleaning the data"
	rm -fr admin/pb_data/*
	rm -f admin/pb

up: bg fg ## 💄 Run all the components quickly
dev: bg fgdev ## 👩‍💻Run all the components in dev mode
