const atlas_search_index={
    "mappings": {
      "dynamic": false,
      "fields": {
        "title": [
          {
            "type": "autocomplete",
            "tokenization": "edgeGram",
            "minGrams": 3,
            "maxGrams": 7,
            "foldDiacritics": false
          },
          {"type":"string"}
        ]
      }
    },
    "storedSource": {
        "include": [
          "title"]
      }
  }