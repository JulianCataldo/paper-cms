# Traefik
rdc-std-t: ddc-std-t udc-std-t
udc-std-t:
	docker compose -f ./std/docker-compose.traefik.yml up --build
ddc-std-t:
	docker compose -f ./std/docker-compose.traefik.yml down

# Local
rdc-std: ddc-std udc-std
udc-std:
	docker compose -f ./std/docker-compose.yml up --build
ddc-std:
	docker compose -f ./std/docker-compose.yml down

prune:
	docker volume prune -f         
	docker system prune -f

# Bundled
# …
#

ctx-p:
	docker context use production
ctx-d:
	docker context use default