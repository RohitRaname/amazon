const atlas_search_index={
    "mappings": {
      "dynamic": false,
      "fields": {
         "content":{
            "type":"document",
            "fields":{

                "text":{
                    "type":"string"
                },
                "title":{
                    "type":"string"
                },
            }
         },
         "modelId":{"type":"objectId"},
       
      }
    }
  }