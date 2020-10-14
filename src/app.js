import algoliasearch from 'algoliasearch';
import { hitTemplate } from './helpers.js';

const searchClient = algoliasearch(
  '0HCA6HLFLT',
  '3a56d2de5dc47337f5c7210913ceeb83'
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

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#categories',
    attributeName: "categories",
    autoHideContainer: false,
    templates: {
      header: "Categories"
    }
  })
)

search.addWidget(
  instantsearch.widgets.stats({
    container: '#stats',
    templates: {
      body(hit) {
        return `<span role="img" aria-label="emoji">⚡️</span> <strong>${hit.nbHits}</strong> results found ${
          hit.query != "" ? `for <strong>"${hit.query}"</strong>` : ``
        } in <strong>${hit.processingTimeMS}ms</strong>`;
      }
    }
  })
)

search.addWidget(
  instantsearch.widgets.refinementList({
    container: "#brands",
    attributeName: "brand",
    searchForFacetValues: true,
    autoHideContainer: false, 
    templates: {
      header: "Brands"
    }
  })
)

search.start();
