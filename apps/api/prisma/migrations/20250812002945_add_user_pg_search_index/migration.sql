CREATE EXTENSION IF NOT EXISTS pg_search;

CREATE INDEX user_search_idx ON public."user"
USING bm25 (id, name, email)
WITH (
  key_field = 'id',
  text_fields = '{
    "name": {
        "tokenizer": {"type":"default"}
            },
    "name_ngram": {
        "tokenizer": {"type":"ngram", "min_gram":3, "max_gram":4, "prefix_only":true},
        "column":"name"
            },
    "email":{
        "tokenizer": {"type": "default", "lowercase": true }
            },
    "email_regex": {
             "tokenizer": {"type": "regex", "pattern": "@"}, 
             "column": "email"
            }
  }'
);
