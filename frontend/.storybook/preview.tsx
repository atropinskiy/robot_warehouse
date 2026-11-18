import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        className="dark min-h-screen bg-background p-6 text-foreground"
        lang="ru"
      >
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
};

export default preview;
