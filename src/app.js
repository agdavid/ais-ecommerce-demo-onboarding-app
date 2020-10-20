import algoliasearch from 'algoliasearch';
import { carouselHitTemplate, hitTemplate } from './helpers.js';

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
    snippetEllipsisText:"..."
  }
});

const carouselSearch = instantsearch({
  indexName: 'demo_ecommerce_price_asc',
  searchClient,
  searchParameters: {
    hitsPerPage: 5,
  } 
})

// use hits connector
// create render function which always has two parameters
// renderOptions includes:
  // widgetParams - all parameters such as container, template, etc.
  // hits - query items
  // results - metadata
// isFirstRender - not always needed
const renderCarousel = (renderOptions, isFirstRender) => {
  const { widgetParams, hits } = renderOptions; 

  widgetParams.container.innerHTML = hits.map((hit) => {
    return carouselHitTemplate(hit);
  }).join('');
}

const carousel = instantsearch.connectors.connectHits(renderCarousel);

search.addWidgets([
  instantsearch.widgets.searchBox({
    container:"#searchbox",
    placeholder: "Search for products",
    autofocus: false
  }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: "No results.",
      item: function(hit) {
        return hitTemplate(hit);
      }
    }
  }),
  instantsearch.widgets.refinementList({
    container: '#categories',
    attributeName: "categories",
    autoHideContainer: false,
    templates: {
      header: "Categories"
    }
  }),
  instantsearch.widgets.stats({
    container: '#stats',
    templates: {
      body(hit) {
        return `<span role="img" aria-label="emoji">⚡️</span> <strong>${hit.nbHits}</strong> results found ${
          hit.query != "" ? `for <strong>"${hit.query}"</strong>` : ``
        } in <strong>${hit.processingTimeMS}ms</strong>`;
      }
    }
  }),
  instantsearch.widgets.refinementList({
    container: "#brands",
    attributeName: "brand",
    searchForFacetValues: true,
    autoHideContainer: false, 
    templates: {
      header: "Brands"
    }
  }),
  instantsearch.widgets.rangeSlider({
    container:"#price",
    autoHideContainer: false,
    attributeName: 'price',
    templates: {
      header: "Price"
    }
  }),
  instantsearch.widgets.pagination({
    container: '#pagination'
  })
])

carouselSearch.addWidgets([
  carousel({
    container: document.querySelector('ul#low-price'),
  })
])

search.start();
carouselSearch.start();
