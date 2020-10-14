import algoliasearch from 'algoliasearch';
import { hitTemplate } from './helpers.js';

const searchClient = algoliasearch(
  'APP_ID',
  'SEARCH_API_KEY'
);

const search = instantsearch({
  indexName: 'demo_ecommerce',
  searchClient,
  searchParameters: {
    hitsPerPage: 5,
    attributesToSnippet: ["description:24"],
    snippetEllipsisText:"[..."
  }
});

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: "No results.",
      item: function(hit) {
        return hitTemplate(hit);
      }
    }
  })
);

search.addWidget(
  instantsearch.widgets.searchBox({
    container:"#searchbox",
    placeholder: "Search for products",
    autofocus: false
  })
);

search.start();
