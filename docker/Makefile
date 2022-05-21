# Traefik  # RECREATE
rdc-std-t: ddc-std-t udc-std-t
udc-std-t: # UP RE-BUILD
	docker compose -f ./std/docker-compose.traefik.yml up --build
ddc-std-t: # DOWN
	docker compose -f ./std/docker-compose.traefik.yml down

# Local    # RECREATE
rdc-std: ddc-std udc-std
udc-std:   # UP RE-BUILD
	docker compose -f ./std/docker-compose.yml up --build
ddc-std:   # DOWN
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

# Production
# make ctx-p rdc-std-t

# Local
# make ctx-d rdc-std
