import { morph, MORPH_OPTIONS } from '@theme/morph';
import { Component } from '@theme/component';
import { StandardEvents, ProductSelectEvent } from '@shopify/events';

class BackInStockComponent extends Component {
  /** @type {Element | null} */
  #section = null;

  connectedCallback() {
    super.connectedCallback();
    this.#section = this.closest('.shopify-section');
    this.#section?.addEventListener(StandardEvents.productSelect, this.#handleProductSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#section?.removeEventListener(StandardEvents.productSelect, this.#handleProductSelect);
  }

  /**
   * Re-renders the form for the newly selected variant.
   * @param {ProductSelectEvent} event - The product select event.
   */
  #handleProductSelect = (event) => {
    if (!(event.target instanceof Element) || event.target.closest('product-card')) return;

    event.promise
      .then(({ detail }) => {
        if (!detail?.html) return;

        const { html, newProduct, productId } = detail;
        if (!newProduct && productId && productId !== this.dataset.productId) return;

        const updated = html.getElementById(this.id);
        if (updated) morph(this, updated, { ...MORPH_OPTIONS, childrenOnly: false });
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.warn('[back-in-stock] Event promise rejected:', error);
      });
  };
}

if (!customElements.get('back-in-stock-component')) {
  customElements.define('back-in-stock-component', BackInStockComponent);
}
