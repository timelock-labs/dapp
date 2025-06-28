# Gemini Workspace

## Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It appears to be a Web3 application based on the included dependencies.

### Key Technologies

*   **Framework:** [Next.js](https://nextjs.org/)
*   **UI:** [shadcn/ui](https://ui.shadcn.com/)
*   **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
*   **Web3:** [Wagmi](https://wagmi.sh/), [RainbowKit](https://www.rainbowkit.com/), [ConnectKit](https://docs.connectkit.family/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Linting:** [ESLint](https://eslint.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

### Project Structure

*   `app/[locale]/`: This directory contains the main application logic, with subdirectories for different features like `auth`, `home`, `timelocks`, etc. The `[locale]` directory suggests that the application supports multiple languages.
*   `components/`: This directory contains reusable UI components.
*   `i18n/`: This directory likely contains the configuration for `next-intl`.
*   `messages/`: This directory contains the translation files for different languages.
*   `public/`: This directory contains static assets like images and icons.
*   `services/`: This directory may contain services for interacting with external APIs or other parts of the application.

### Getting Started

To run the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```