# 📑  Paper CMS  📝

A document-based headless CMS with API + back office.

Made primarly for editorial content management.  
Stock definitions are modelled after Schema.org vocabulary.

---

- [📑  Paper CMS  📝](#paper-cms)
- [🏁  Usage](#usage)
  - [Live demo](#live-demo)
  - [or… local quick start 📦](#or-local-quick-start-)
  - [or… with Docker Compose 🐳](#or-with-docker-compose-)
- [❄️  Features](#️features)
  - [Auto-generated forms from OpenAPI definitions](#auto-generated-forms-from-openapi-definitions)
  - [JSON Schema validation on run-time for both client and server](#json-schema-validation-on-run-time-for-both-client-and-server)
  - [UI Schema augmentation (non-standard)](#ui-schema-augmentation-non-standard)
  - [JSON files database](#json-files-database)
  - [Image(s) upload + dynamic resize while fetching + caching](#images-upload--dynamic-resize-while-fetching--caching)
  - [JWT authentication for both human editors and API consumers](#jwt-authentication-for-both-human-editors-and-api-consumers)
  - [Live browser reload while editing models / client / server](#live-browser-reload-while-editing-models--client--server)
  - [Document revisions history](#document-revisions-history)
  - ["Has many" relationship via references](#has-many-relationship-via-references)
  - [Nested referenced documents edition](#nested-referenced-documents-edition)
  - [Schema.org inspired default definitions](#schemaorg-inspired-default-definitions)
  - [OpenAPI 3 UI (Swagger)](#openapi-3-ui-swagger)
  - [Wysiwyg HTML Editor](#wysiwyg-html-editor)
  - [Custom fields and widgets](#custom-fields-and-widgets)
- [🤔  Why?](#why)
  - [Inspirations](#inspirations)
  - [Goals](#goals)
- [ℹ️  Project insights](#ℹ️project-insights)
  - [Structure](#structure)
  - [Major dependencies](#major-dependencies)
  - [Work in progress](#work-in-progress)
  - [To do](#to-do)
  - [Features ideas](#features-ideas)

---

# 🏁  Usage

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

# ❄️  Features

## Auto-generated forms from OpenAPI definitions

https://user-images.githubusercontent.com/603498/169503745-7be7124c-5d47-4170-85fb-e32d4ada58bd.mp4

## JSON Schema validation on run-time for both client and server

…

## UI Schema augmentation (non-standard)

…

## JSON files database

…

## Image(s) upload + dynamic resize while fetching + caching

…

## JWT authentication for both human editors and API consumers

https://user-images.githubusercontent.com/603498/169494704-6ee7afcb-31f5-4cc5-b126-e109bd24606f.mp4

## Live browser reload while editing models / client / server

…

## Document revisions history

…

## "Has many" relationship via references

…

## Nested referenced documents edition

…

## Schema.org inspired default definitions

…

## OpenAPI 3 UI (Swagger)

…

## Wysiwyg HTML Editor

…

## Custom fields and widgets

…

# 🤔  Why?

## Inspirations

We are seeing the emergence of different patterns in the content management
world like:

- Shared entities vocabularies
- Automatic web form generation
- Isomorphic user input runtime validation,
- Entity / Collection oriented information architecture
- Headless non-opinionated CMS APIs for JAMStack consumption
- Hypermedia for non-deterministic data fetching via _refs. | links | URIs_…
- Plain files data storage for operations convenience (with some trade-offs)

## Goals

All these concepts are explored at different levels of implementations
in Paper CMS.  
While it's still an experiment, the end-goal is to provide a lightweight
solution suitable for projects which:

- Has ten-ish max. editors in charge
- Needs moderate authoring concurrency with silo-ed document edits
- Might needs frequent content updates
- Low needs for user-land data input

To sum up: Paper CMS is good for **editors-driven websites**, but is not a
good fit for **users-driven web apps**.

# ℹ️  Project insights

> ⚠️ Work in progress: **NOT FOR PRODUCTION** ⚠️

## Structure

Mono-repo. glued with PNPM recursive modules installation.

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

## Work in progress

- Single media management
- Batch media management
- Media metadata with EXIF + IPTC support
- JSON/LD API output conformance
- OpenAPI conformance
- Swagger integration
- Wider Schema.org support for stock definitions

## To do

- API collections' pagination
- Custom data fetching and population widgets for APIs / social networks content retrieval

## Features ideas

- Might propose fully dynamic OpenAPI GUI builder right inside the back office,
  instead OR alongside YAML config.
- Might propose MongoDB/pSQL/S3 alternative to bare file storage,
  for increased **mass** and/or **concurrency** needs,
  but decreased portability.
- Might propose an option for storing media binaries in an S3 bucket.

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
