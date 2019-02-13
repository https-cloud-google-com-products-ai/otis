# Vocabulary

The gene vocabulary was downloaded from https://www.genenames.org/download/custom/.

The disease vocabulary was downloaded using the following API calls:

- [EFO](http://api.opentargets.io/v3/platform/public/search?filter=disease&q=EFO&size=10000&fields=id&fields=name)
- [Orphanet](http://api.opentargets.io/v3/platform/public/search?filter=disease&q=Orphanet&size=10000&fields=id&fields=name)

These files were then processed using:

```
cat ../rasa/vocabulary/efo-raw.json | jq -r '.data[].data.name' > data/disease/name.csv
cat ../rasa/vocabulary/orphanet-raw.json | jq-r '.data[].data.name' > data/disease/orphanet.csv
cat data/disease/efo.csv data/disease/orphanet.csv | sort > data/disease/name.csv
```
