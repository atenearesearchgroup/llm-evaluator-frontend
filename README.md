# Hermes Analyzer - Frontend

## Description

This repository is part of a TFG project related to the evaluation of the capabilities of Large Language Models (LLM).
This application serves as the web interface for the backend found [HERE](https://github.com/atenearesearchgroup/llm-evaluator-backend).

### Abstract

The advancement of Large Language Models (LLMs) and the potential of their applications have led to a growing interest
for its the application to Model Driven Software Engineering. In this field, LLMs have started to be used for the
automatic creation of software models given a natural language description of the domain to be modelled. This has led to
the identification of a research niche focused on the evaluation of the modelling capabilities of LLMs.

This project has two main contributions. Firstly, the capabilities of different LLMs in class diagram generation tasks
are studied and analysed. This first study is done in an exploratory way following the same process that was published
in the following research paper for ChatGPT: ``On the assessment of generative AI in modeling tasks: an experience
report with ChatGPT and UML'' by Javier Cámara, Javier Troya, Lola Burgueño, and Antonio Vallecillo, published in 2023
in the journal Software and Systems Modeling. These exhaustive tests try to observe, analyse and compare the
capabilities, strengths and weaknesses of some of the language models that are most popular today.

Secondly, and based on the results obtained in the previous phase, this TFG provides the definition of a systematic and
reproducible procedure for the future evaluation of the usefulness and applicability of language models.

To facilitate the application of this procedure, defined as a workflow, a web application has been developed that
provides an accessible, intuitive and user-friendly interface. This application is designed to guide users through the
procedure without the need to memorise each step, thus optimising the workflow.

## Usage

### Local development

#### Prerequisites

- **Node.JS** version must be **v20.12 or newer** 

#### Step 1: Setup env variables

Copy ``.env.example`` and rename it to ``.env.development`` or a proper env file name (See Astro documentation about .env files [**HERE**](https://docs.astro.build/en/guides/environment-variables/#env-files)), then modify the environment variables. An example of valid environment file might be:

```
BACKEND_API_URL='http://localhost:8080'
PUBLIC_BACKEND_API_URL='http://localhost:8080'
```

> **Consideration**: When using WSL for development environment and having the Backend hosted on the Windows host (not Docker), you must be sure ``BACKEND_API_URL``
> environment variable is set to your local host domain, as for example ``DESKTOP-AAAA.local``. You can get it by using ``echo "$(hostname).local"`` in WSL terminal.

#### Step 2: Run development script

You can run development mode by using:

```
npm run dev
```

### Local deploy with Docker

#### Prerequisites

To be able to run the project you only need to have installed [Docker](https://www.docker.com) and the [Backend](https://github.com/atenearesearchgroup/llm-evaluator-backend).

#### Step 1: Setup env variables and Build

Copy ``.env.example`` and rename it to ``.env.production`` or something with higher priority than ``.env.development``, then modify the environment variables. An example of valid environment file might be:

```
BACKEND_API_URL='http://host.docker.internal:8080'
PUBLIC_BACKEND_API_URL='http://localhost:8080'
```

> **Consideration**: When backend is hosted locally, you must be sure ``BACKEND_API_URL``
> environment variable is set to ``host.docker.internal`` to be able to connect the server side of the Fronted to the Backend.

After setting it up, you can use the provided [Dockerfile](https://github.com/atenearesearchgroup/llm-evaluator-frontend/blob/master/Dockerfile) to generate the needed image you will need to use the command:

```
docker build -t hermesanalyzer/frontend .
```

It will have generated a docker image with the tag `hermesanalyzer/frontend`.

#### Step 2: Run the container

Now, you can run it by using the command (Use -d to detach):

```
docker run -p 4321:4321 -t hermesanalyzer/frontend -it
```

## Technology Stack

This project uses **Node.js >v20.12** and **TypeScript**.

Most important frameworks or dependencies:
- [Astro](https://astro.build) - Agnostic web framework, zero JS by default.
- [React](https://es.react.dev) - JavaScript framework for web interactivity.
- [Tailwind](https://tailwindcss.com) - Utility-first CSS framework.
- [Shadcn](https://ui.shadcn.com) - Component library for building the interface.

## Authors

> See the list of [contributors](https://github.com/atenearesearchgroup/llm-evaluator-backend/graphs/contributors) who
> participated in this project.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](./LICENSE) file for details
