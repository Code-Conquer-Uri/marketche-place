-- CreateIndex
CREATE INDEX "organization_search_index" ON public."organization"
USING bm25 (id, name, slug)
WITH (
  key_field = 'id',
  text_fields = '{
    "name": {
        "tokenizer": {"type":"default"}
            },
    "name_ngram": {
        "tokenizer": {"type":"ngram", "min_gram":3, "max_gram":6, "prefix_only": false},
        "column":"name"
            },
    "slug": {
        "tokenizer": {"type":"default"}
            }
  }'
);



-- CreateIndex
CREATE INDEX "product_search_index" ON public."product"
USING bm25 (id, title, description)
WITH (
  key_field = 'id',
  text_fields = '{
    "title": {
        "tokenizer": {"type":"default"}
            },
    "title_ngram": {
        "tokenizer": {"type":"ngram", "min_gram":3, "max_gram":6, "prefix_only": false},
        "column":"title"
            },
    "description": {
        "tokenizer": {"type":"default"}
            },
    "description_icu": {
        "tokenizer": {"type": "icu"},
        "column":"description"
            }
  }'
);

