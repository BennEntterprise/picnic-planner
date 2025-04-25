# I-Build: Picnic Planner App by Kyle Bennett

This document will follow a similar convention to an [i-search](https://gallaudet.edu/student-success/tutorial-center/english-center/citations-and-references/i-search-paper-format-guide/) paper. It is meant to take the form of a narrative where we explain a little about a topic, but then maintain a real-time blog style of writing that cronicles the journey of building a project. 

I was given a [spec README.md](./README.md) for a picnic planning app. It spells out some criteria but since it doesn't cover EVERYTHING I'm going to set some additional constraints for myself. 

## Self-Imposed Constraints

I'm going to impost the following constraints to make sure this coding task can be done in the 4hr time block.

1. No deployment, local builds/runs only. CI/CD gets pretty complex especially if we are getting into high availabilily, TLS certs and whatnot. So this full-stack app should just run locally. I will include some code-quality check on pre-commit that mimic CI/CD Code quality but again, just local for now. (In a real devops inner loopthose checks would be intended to run _pre-push_  but since I'm only pushing once to submit my PR, I'll use pre-commits for now.)
2. No Mobile. Since I'm writing this on a 13in Mac Book Pro I'm going to presume my reviewers are on similar Laptop/Desktop style and so I won't be messing around with CSS for mobile views, nor doing any extreme optimization for low bandwidth networks. We will still employ caching to minimize network requests (as part of the task requirements), but again we aren't considering the footprint of each of those requests.
3. Ideal, Fair Poor Criteria. This is entirely subjective to my own experience as a kid who grew up in the North East of the United States (Castkills of NY, Fredonia NY and Pittsburg PA). If I had additional time I'd love for the user to be able to set their own criteria, either directly setting parameters or by chatting with an LLM about their "ideal day" and letting the LLM set those parameters. Perhaps something like [Transformers.js](https://huggingface.co/docs/transformers.js/index) which I first heard about on [Syntax.fm](https://syntax.fm/show/740/local-ai-models-in-javascript-machine-learning-deep-dive-with-xenova) but that's more indepth than I have time for. For now I'm going to use chance of precipitation and temperature as my rough proxies for Ideal, fair and Poor. My design for this algorithm though will attempt to be open to extension ensuring alterations to the heuristics will be low cost later. 
4. Documentation. I'm going to use this file (i-build.md) to cronicle my building. I'll leave README.md intact (as it has my spec requirements). I will then use a single CONTRIBUTING.md to describe how someone might get this application running locally and expect to contribute to the codebase. I also set myself as default owner in the CODEOWNERS file to leverage Github review mechanics to automatically reviewer. If we had groups we might also add a group to that file (out of scope).
5. Caching. Will likely use Redis to cache forecast information by ZipCode. If not just store it in the databse. I'll likely have this expire after an hour. To help with visualizing on the frontend I think it would be nice to show when data has returned from a cache or a full request to the API but maybe I'll leave that out. 🤷‍♂️
6. Local Development. If this were intended to be deployed to a Kubernetes cluster I might advocate a development environment that most mimics production by using tools like [Minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download) or [k3s](https://k3s.io/) on [k3d](https://k3s.io/). However, I'm going to stick with one nodejs/express backend and a single react application that are composed together (with any other resources like redis) with Docker. Design of the express application will try to ensure that should we move to multiple microservices later, we can "lift-and-shift" entire groups of routers/controllers/services to our heart's content. Building separate services instead of a react-app-within-node-app-monolith will put us one partial step closer to a read deployed microservice architecture.


## Setting my local environment

### Overview

My preferred stack (based on comfort, not necessarily the right tool for this task) is Full-Stack Typescript (react and express) with a Postgres persistence layer and a redis cache. I'm going to scaffold all of this not as a monolith, but as monorepo utilizing [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) and likely [turborepo](https://turborepo.com/). Turborepo builds on workspaces by allowing caching npm builds and also enabling some nice workflows when running scripts across multiple project. 

Each project should be able to run on it's own (they are afterall each their own NPM project) however the intendend development flow is to use [Docker](https://www.docker.com/) and the docker-compose so I will focus on that flow.

(paused here to go write the beginning of the [CONTRIBUTING.md](./CONTRIBUTING.md) document.)
(I've just finished the beginning of the contributing document which outlines the requirements and includes the `install` and `dev` commands. Now let's into building a bunch of scaffolding code.)

### Npm Workspaces and Turbo Repo

#### Set the workspaces
I'm going to set up 2 projects within the `apps` folder, a frontend and backend. 

`npm init -w apps/fr`
`npm init -w apps/be`

This gives me an empty project in those locations each with their own package.json file. I also need to create/update a `.gitignore` to exclude node_modules.

#### Scaffold basic apps in each workspace

I'll need a react app in the fe and an express app in the backend, both should use typescript. 

I opt for the [quickstart guide for vite](https://vite.dev/guide/) using the command `npm create vite@latest . -- --template react-ts` to scaffold a frontend.

[This blog](https://blog.logrocket.com/express-typescript-node/) provides a fairly good start for an express backend but I will want to include [drizzleORM](https://orm.drizzle.team/) so I won't follow this exactly as I scaffold my express project. But here's what I'll be happy to steal for the sake of speed:

- `npm install express dotenv npm install -D typescript ts-node @types/node @types/express nodemon eslint prettier` gets me some basic dependencies I'll need (both production and development). 
- `npx tsc --init` gets me a simple `tsconfig.json` I'll probably leave most of this. 
- I lifted the `prettier` and `eslint` configs from the blog post above. 
- I'm also happy enough with the scripts provided in the blog for `start` and `dev` so I shamelessly steal those for `apps/be/package.json`.

#### My mind is racing with what is left to do!

I'm going to take a sec here because we've now got a front and backend that can run. I haven't even gotten to the meat of the assignment yet, but that's because there's so much foundation that (in my view) _should be done before you get to the meat_. This boilerplat is going to take me a bit longer to get done and I might end up spending more than the 2-4hrs on the project prescribed (I've already spent about 1.5) but as this project is under open source I wnat to ensure this is something I'm proud to demo even after this interview. 

The best way to keep track of a project is with something like Trello or Jira, that's overblown for this project so I'm going to use [Todo.md](./TODO.md) at the root of this repo. It is a rankend queue of what I intend to get done in the next steps. Stuff that comes up might not necessarily end up at the top or bottom, it will get inserted where I think it's appropriate. 

#### TurboRepo + Code-Quality Checks

Now that I have a front and backend I want to ensure that any time I commit I am committing VALID CODE: never break main! Turborepo combined with pre-commit & pre-push hooks will help me with this. Many teams will run these types of checks on a pull request but we chose to do them at the developer level believing that [Shifting Left](https://en.wikipedia.org/wiki/Shift-left_testing) helps full stack developers actually be "full stack" rather than throwing their code over to the devops cycle. In my opinion shifting left helps developers understand what needs to happen before pushing code to production.

So in this commit I added [TurboRepo](https://turborepo.com/docs) which has one task, `build`. This means that at the root of the repo I can set an npm script `build` => `turbo run build` => `npm run build (in each of the apps!)`. This parallelization and some out-of-the-box-caching should stop any whiners who whine "The build steps take so long on each commit". We also can do some more advance caching in the future by declaring our inputs and outputs of the given task to leverage deterministic builds. If we get super mature we can even us [Remote Caching](https://turborepo.com/docs/crafting-your-repository/constructing-ci#enabling-remote-caching) so our team can share their build caches (out of scope for now).
