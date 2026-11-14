import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["../stories/**/*.stories.tsx"],
  staticDirs: [{ from: "../public/robots", to: "/robots" }],
  viteFinal(config) {
    return { ...config, plugins: [...(config.plugins ?? []), tailwindcss()] };
  },
};

export default config;
