# pbj-sandbox
Sample store for PB+J

Store: pbj-sandbox.myshopify.com
Store password: udifli

## Recent Changes
- Added new product fit slider component
- Updated product information section
- Improved base and custom CSS for layout and style
- Enhanced product media and details blocks

## Technical details
From a technical leadership perspective, the recent work focused on refining the product media experience to ensure that only images relevant to the selected color variant are displayed. This was achieved by filtering the product media collection based on the alt text, which is matched to the active color option. The logic is modular and maintainable, with clear in-code documentation to support future enhancements or variant-based customizations.

## End user considerations
For the end user, the expected experience is seamless: when a shopper selects a color, the gallery instantly updates to show only the images for that color, reducing confusion and making the product selection process more intuitive and visually relevant.

## Accessibility (a11y) recommendations

- Ensure all product images have descriptive alt text, especially since filtering relies on this attribute.
- Maintain keyboard navigability and focus management within the media gallery.
- Choose a color palette that meets WCGA requirements.
- Use ARIA roles and labels where appropriate to support assistive technologies.
- Always use a responsive image snippet so we can leverage the Shopify CDN to generate responsive `img` tags.
- Use native elements whenever possible. New ones like dialog for modals and details for accordions provide basic accessibility enhancements out of the box, then adding ARIA and JS enhancements where needed.

## Shopify Theme Development

There are a number of really useful tools that the Shopify Themes team uses during development. Horizon is already set up to work with these tools.

### Shopify CLI

[Shopify CLI](https://github.com/Shopify/shopify-cli) helps you build Shopify themes faster and is used to automate and enhance your local development workflow. It comes bundled with a suite of commands for developing Shopify themes—everything from working with themes on a Shopify store (e.g. creating, publishing, deleting themes) or launching a development server for local theme development.

You can follow this [quick start guide for theme developers](https://shopify.dev/docs/themes/tools/cli) to get started.

## Contributing

Want to make commerce better for everyone by contributing to Horizon? We'd love your help! Please read our [contributing guide](https://github.com/Shopify/Horizon/blob/main/.github/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build for Horizon.

## Code of conduct

All developers who wish to contribute through code or issues, please first read our [Code of Conduct](https://github.com/Shopify/Horizon/blob/main/.github/CODE_OF_CONDUCT.md).