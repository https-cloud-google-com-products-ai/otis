# Otis

Otis is intended to improve Open Targets search capability to support more complex queries.

## What is it?

Otis is built primarily from two libraries. The first, [rasa](https://rasa.com/), builds an NLU model to classify intent from user input. The second, [botkit](https://botkit.ai/), builds a web-based chatbot that delegates intent classification to the rasa model.

The chatbot is primarily to used to show the search history for development purposes and to return markdown responses without setting up a full application. The search could potentially be powered by the rasa interface alone.

The setup is inspired by this [blog post](https://medium.com/@harjun1601/building-a-chatbot-with-botkit-and-rasa-a18aa4d69ebb).

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

### Generate the training data

To train a model to identify intents, we need training data. [Chatito](https://github.com/rodrigopivi/Chatito) can generate the training data based on entity dictionaries and phrase models.

```
# in the rasalookup/chatito directory
chatito generator.chatito --format=rasa
```

### Build the NLU model

The following command builds a model in the `rasalookup/models/default` directory. You should only need to run this once. However, if you edit the `rasa/nlu.md` file, you should rerun this step.

```
# in the rasalookup directory
python -m rasa_nlu.train -c config/config_tf.yaml --path models --data chatito/rasa_dataset_training.json

# the model can be (optionally) evaluated against test data
python -m rasa_nlu.evaluate --model models/default/<latest-model> --data chatito/rasa_dataset_testing.json --verbose
```

### Run the rasa server

To talk to the rasa API, start the built-in server on port 5000.

```
# in the rasalookup directory
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
