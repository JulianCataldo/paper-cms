# 📑  Paper CMS  📝

A document-based headless CMS with API + back office.

Made for low interactivity content management.  
Stock definitions are modelled after Schema.org vocabulary.

## Live demo

**👉  [Check here](https://www.juliancataldo.com/apps/) for a Paper CMS online tryout.**  
🔁  *Default dataset is reseted periodically.*  
🔑  Use good ol' `admin` / `password`.

## or… local quick start 📦

```sh
# Clone this repo
git clone git@github.com:JulianCataldo/paper-cms.git
cd paper-cms
code ./

# Install all dependencies
npm run deps:i

# Run and watch API + back office
npm run dev

# Open back office in browser
open http://localhost:7777

# Default credentials
# > User : `admin`
# > Password : `password`

# Edit API definition
code ./models/api-v1.yaml -r

# Created entries and uploaded medias + variations
# are stored in root project by default in `.data`
tree ./.data
```

## or… with Docker Compose 🐳

```sh
npm run dcu:std

# Data persistence folder
tree ./docker/std/.volume/.data
```

## Features

- Auto-generated forms from OpenAPI definitions
- JSON Schema validation on run-time for both client and server
- JSON files database
- Image(s) upload + dynamic resize while fetching + caching
- JWT authentication for both human editors and API consumers
- Live browser reload while editing models / client / server
- Document revisions history
- "Has many" relationship via references
- Nested referenced documents edition
- Schema.org inspired default definitions
- OpenAPI 3 UI (Swagger)
- Wysiwyg HTML Editor
- Custom fields and widgets

## Why?

We are seeing the emergence of different patterns in the content management
world like:

- Shared entities vocabularies
- Automatic web form generation
- Isomorphic user input runtime validation,
- Document based information architecture
- Headless non-opinionated APIs
- Hypermedia for non-deterministic data fetching
- Plain files data storage for operations convenience (with trade-offs)

All these concepts are explored at different levels of implementations
in Paper CMS.  
The endgoal is to provide a lightweight solution that might be suitable
for relatively static web sites like :

- Ten-ish max. editors in charge
- Few concurrent document edition
- Might needs frequent content updates
- Low needs for user-land data input

To sum up: good for **editors-driven websites** but not a good fit for
**users-driven web apps**.

## Major dependencies

- Node.js
- ESBuild
- React
- MUI
- React Quill
- JSON Schema React
- AJV
- Express
- Sharp

## Project insights

> ⚠️ Work in progress: **NOT FOR PRODUCTION** ⚠️

### Structure

Mono-repo. glued with PNPM recursive modules installation.

### Work in progress

- Single media management
- Batch media management
- Media metadata with EXIF + IPTC support
- JSON/LD API output conformance
- OpenAPI conformance
- Swagger integration
- Wider Schema.org support for stock definitions

### To do

- API collections' pagination
- Custom data fetching and population widgets for APIs / social networks content retrieval

### Features ideas

- Might propose fully dynamic OpenAPI GUI builder right inside the back office
  instead or alongside YAML config.
- Might propose MongoDB/pSQL alternative to bare file storage,
  for increased **mass** and/or **concurrency** needs,
  but decreased portability.

---

```


,-.----.                  ,-.----.
\    /  \     ,---,       \    /  \      ,---,.,-.----.
|   :    \   '  .' \      |   :    \   ,'  .' |\    /  \
|   |  .\ : /  ;    '.    |   |  .\ :,---.'   |;   :    \
.   :  |: |:  :       \   .   :  |: ||   |   .'|   | .\ :
|   |   \ ::  |   /\   \  |   |   \ ::   :  |-,.   : |: |
|   : .   /|  :  ' ;.   : |   : .   /:   |  ;/||   |  \ :
;   | |`-' |  |  ;/  \   \;   | |`-' |   :   .'|   : .  /
|   | ;    '  :  | \  \ ,'|   | ;    |   |  |-,;   | |  \
:   ' |    |  |  '  '--'  :   ' |    '   :  ;/||   | ;\  \
:   : :    |  :  :        :   : :    |   |    \:   ' | \.'
|   | :    |  | ,'        |   | :    |   :   .':   : :-'
`---'.|    `--''          `---'.|    |   | ,'  |   |.'
  `---`                     `---`    `----'    `---'
                                                  ____
                               ,----..          ,'  , `.  .--.--.
                              /   /   \      ,-+-,.' _ | /  /    '.
                             |   :     :  ,-+-. ;   , |||  :  /`. /
                             .   |  ;. / ,--.'|'   |  ;|;  |  |--`
                             .   ; /--` |   |  ,', |  ':|  :  ;_
                             ;   | ;    |   | /  | |  || \  \    `.
                             |   : |    '   | :  | :  |,  `----.   \
                             .   | '___ ;   . |  ; |--'   __ \  \  |
                             '   ; : .'||   : |  | ,     /  /`--'  /
                             '   | '/  :|   : '  |/     '--'.     /
                             |   :    / ;   | |`-'        `--'---'
                              \   \ .'  |   ;/
                               `---`    '---'

```

👉  [www.JulianCataldo.com](https://www.juliancataldo.com)
