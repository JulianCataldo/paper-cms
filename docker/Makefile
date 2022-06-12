# Traefik
rdc-std-t: ddc-std-t udc-std-t
	@echo ••• RECREATE
udc-std-t:
	@echo ••• UP RE-BUILD
	docker compose -p paper-cms -f ./standard/docker-compose.traefik.yml up --build
ddc-std-t:
	@echo ••• DOWN
	docker compose -p paper-cms -f ./standard/docker-compose.traefik.yml down

# Local
rdc-std: ddc-std udc-std
	@echo ••• RECREATE
udc-std:
	@echo ••• UP RE-BUILD
	docker compose -p paper-cms -f ./standard/docker-compose.yml up --build
ddc-std:
	@echo ••• DOWN
	docker compose -p paper-cms -f ./standard/docker-compose.yml down

prune:
	@echo ••• PRUNE
	docker volume prune -f
	docker system prune -f

# Bundled
# …
#

# Contexts
ctx-p:
	@echo ••• SWITCH TO PRODUCTION
	docker context use production
ctx-d:
	@echo ••• SWITCH TO DEFAULT
	docker context use default

# Deploys
prod: ctx-p rdc-std-t
	@echo ••• DEPLOYING PRODUCTION
local: ctx-d rdc-std
	@echo ••• DEPLOYING LOCAL
