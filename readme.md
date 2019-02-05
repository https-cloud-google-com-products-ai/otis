# Otis

Otis is intended to improve Open Targets search capability to support more complex queries.

## What is it?

Otis is built primarily from two libraries. The first, [rasa](https://rasa.com/), builds an NLU model to classify intent from user input. The second, [botkit](https://botkit.ai/), builds a web-based chatbot that delegates intent classification to the rasa model. The setup is inspired by this [blog post](https://medium.com/@harjun1601/building-a-chatbot-with-botkit-and-rasa-a18aa4d69ebb).

## How do I run it?

Follow the instructions below for a local development environment.

### Installation (python dependencies)

The rasa step requires a python NLP library called [spaCy](https://spacy.io/). The following could be done in a virtual environment, if preferred.

```
pip install spacy
pip install rasa_core
pip install rasa_nlu[spacy]
pip install service_identity
```

### Build the NLU model

The following command builds a model in the `rasa/models/default` directory. You should only need to run this once. However, if you edit the `rasa/nlu.md` file, you should rerun this step.

```
python -m rasa_nlu.train -c nlu_config.yml --path models --data nlu.md
```

### Run the rasa server

To talk to the rasa API, start the built in server on port 5000.

```
python -m rasa_nlu.server --path models
```

### Installation (javascript dependencies)

The botkit server uses node, so first install dependencies.

```
yarn install
```

### Run the botkit server

To talk to the bot, start the server on port 3000.

```
yarn start
```

Now visit http://localhost:3000 and start chatting!
