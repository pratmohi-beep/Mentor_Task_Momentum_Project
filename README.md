# Momentum Angular profile form

A responsive three-step profile form built with Angular standalone components and Cisco Momentum UI Web Components.

## Run locally

Use Node.js 20.19 or newer and pnpm:

```sh
pnpm install
pnpm start
```

Open the local URL printed by Angular CLI. Create a production build with `pnpm build`.

## Momentum Toggle integration

The app uses Cisco's `@momentum-design/components` Toggle (`mdc-toggle`) inside the `mdc-themeprovider`. The component modules are registered once in the root component, Angular's `CUSTOM_ELEMENTS_SCHEMA` allows the custom elements, and the light and dark Momentum token styles plus typography styles are imported globally. The theme switch changes the provider's theme class between the official stable light and dark Webex themes.

The personal and address controls use native inputs inside Angular's typed reactive form so validation, accessibility attributes, and value tracking work directly with Angular. Form values are saved to local storage on change and restored when the app is reopened.
