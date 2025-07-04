import { Component } from '@theme/component';
import { ThemeEvents, VariantUpdateEvent, ZoomMediaSelectedEvent } from '@theme/events';

/**
 * A custom element that renders a media gallery.
 *
 * @typedef {object} Refs
 * @property {import('./zoom-dialog').ZoomDialog} [zoomDialogComponent] - The zoom dialog component.
 * @property {import('./slideshow').Slideshow} [slideshow] - The slideshow component.
 * @property {HTMLElement[]} [media] - The media elements.
 *
 * @extends Component<Refs>
 */
export class MediaGallery extends Component {
  connectedCallback() {
    super.connectedCallback();

    const { signal } = this.#controller;
    const target = this.closest('.shopify-section, dialog');

    target?.addEventListener(ThemeEvents.variantUpdate, this.#handleVariantUpdate, { signal });
    this.refs.zoomDialogComponent?.addEventListener(ThemeEvents.zoomMediaSelected, this.#handleZoomMediaSelected, {
      signal,
    });

    // Filter media on initial load based on selected variant
    this.#filterMediaOnLoad();
  }

  #controller = new AbortController();

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#controller.abort();
  }

  /**
   * Handles a variant update event by filtering media based on selected color option.
   *
   * @param {VariantUpdateEvent} event - The variant update event.
   */
  #handleVariantUpdate = (event) => {
    // Filter media based on selected color option
    this.#filterMediaByColor(event);
    
    const source = event.detail.data.html;

    if (!source) return;
    const newMediaGallery = source.querySelector('media-gallery');

    if (!newMediaGallery) return;

    this.replaceWith(newMediaGallery);
  };

  /**
   * Filters media on initial page load based on currently selected variant.
   */
  #filterMediaOnLoad = () => {
    const variantPicker = document.querySelector('variant-picker');
    if (!variantPicker) return;

    const selectedOptions = variantPicker.querySelectorAll('input:checked, option[selected]');
    if (selectedOptions.length === 0) return;

    // Get the selected color option
    const colorOption = Array.from(selectedOptions).find(option => {
      const value = option.value || option.textContent?.trim() || '';
      return this.#isColorValue(value) || 
             value.toLowerCase().includes('color') || 
             value.toLowerCase().includes('colour');
    });

    if (!colorOption) return;

    const selectedColor = colorOption.value || colorOption.textContent?.trim() || '';
    this.#applyColorFilter(selectedColor);
  };

  /**
   * Filters media gallery images based on selected color option.
   * Only shows images whose alt text contains the selected color name.
   *
   * @param {VariantUpdateEvent} event - The variant update event.
   */
  #filterMediaByColor = (event) => {
    const variant = event.detail.variant;
    if (!variant || !variant.options) return;

    // Find the color option (assuming it's typically the first option, but could be any)
    const colorOption = variant.options.find(option => 
      option.toLowerCase().includes('color') || 
      option.toLowerCase().includes('colour') ||
      this.#isColorValue(option)
    ) || variant.options[0]; // Fallback to first option if no color found

    if (!colorOption) return;

    this.#applyColorFilter(colorOption);
  };

  /**
   * Applies color filtering to media containers.
   *
   * @param {string} colorOption - The selected color option.
   */
  #applyColorFilter = (colorOption) => {
    // Filter slideshow slides
    const slideshowContainers = this.querySelectorAll('slideshow-component .product-media-container');
    slideshowContainers.forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;

      const altText = img.alt?.toLowerCase() || '';
      const shouldShow = altText.includes(colorOption.toLowerCase());
      
      // Show/hide slide based on color match
      const slide = container.closest('slideshow-slide');
      if (slide) {
        slide.style.display = shouldShow ? '' : 'none';
      }
    });

    // Filter grid media containers
    const gridContainers = this.querySelectorAll('.media-gallery__grid .product-media-container');
    gridContainers.forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;

      const altText = img.alt?.toLowerCase() || '';
      const shouldShow = altText.includes(colorOption.toLowerCase());
      
      // Show/hide grid item based on color match
      container.style.display = shouldShow ? '' : 'none';
    });

    // Update slideshow if present
    if (this.refs.slideshow) {
      this.#updateSlideshowAfterFilter();
    }
  };

  /**
   * Updates slideshow after filtering to ensure proper navigation.
   */
  #updateSlideshowAfterFilter = () => {
    const allSlides = this.querySelectorAll('slideshow-slide');
    const visibleSlides = this.querySelectorAll('slideshow-slide:not([style*="display: none"])');
    
    if (visibleSlides.length > 0) {
      // Navigate to first visible slide
      const firstVisibleIndex = Array.from(allSlides)
        .findIndex(slide => !slide.style.display.includes('none'));
      
      if (firstVisibleIndex >= 0 && this.refs.slideshow) {
        this.refs.slideshow.select(firstVisibleIndex, undefined, { animate: false });
      }
    }
  };

  /**
   * Checks if a value is likely a color name.
   *
   * @param {string} value - The value to check.
   * @returns {boolean} True if the value appears to be a color.
   */
  #isColorValue = (value) => {
    const commonColors = [
      'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 
      'black', 'white', 'gray', 'grey', 'navy', 'maroon', 'teal', 'olive',
      'lime', 'aqua', 'silver', 'gold', 'beige', 'tan', 'coral', 'salmon'
    ];
    
    return commonColors.some(color => 
      value.toLowerCase().includes(color)
    );
  };

  /**
   * Handles the 'zoom-media:selected' event.
   * @param {ZoomMediaSelectedEvent} event - The zoom-media:selected event.
   */
  #handleZoomMediaSelected = async (event) => {
    this.slideshow?.select(event.detail.index, undefined, { animate: false });
  };

  /**
   * Zooms the media gallery.
   *
   * @param {number} index - The index of the media to zoom.
   * @param {PointerEvent} event - The pointer event.
   */
  zoom(index, event) {
    this.refs.zoomDialogComponent?.open(index, event);
  }

  get slideshow() {
    return this.refs.slideshow;
  }

  get media() {
    return this.refs.media;
  }

  get presentation() {
    return this.dataset.presentation;
  }
}

if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', MediaGallery);
}
