# TODO List

[x] TurboRepo (npm run build)
[x] Pre Commit Code Quality sHook(s)
[x] Docker Compose Frontend + Backend
[x] Fix Linting & Formatting
[x] Decide how to architect an inter-changable/extensible/composable weather API (strategy, factory, and proxy)
[x] Add Unit testing
[] Implement an WeatherService Interface that any instance should conform to.
[] Implement a concrete weather service for `openmeteo`
[] Implement a [factory](https://sbcode.net/typescript/factory/) to build the weather service.
[] Add Redis to Docker-compose
[] Add user-input field to accept zip codes for custom weather.
[] Test End To End
[] Implement [proxy](https://sbcode.net/typescript/proxy/) that calls the factory which builds the correct weather interface
[] Use a utility to get typed request/responses?
[] Shared Types in a 3rd package?


Decided to Definitely Deferred
[] ConfigConsumption (process.env => Zod?)
[] SECURITY: run npm audit before pushing to remote
[] SECURITY: Inspect docker images for vulns
[] AI Gen frontend for user preferences on choosing poor, fair, good conditions?