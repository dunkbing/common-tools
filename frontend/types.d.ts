declare module "composerize" {
  export default function composerize(
    input: string,
    existingComposeFile: string = "",
    composeVersion: "latest" | "v2x" | "v3x" = "latest",
    indent: number = 4
  ): ?string {}
}

declare module "decomposerize" {
  export type Configuration = {
    command?: string;
    rm?: boolean;
    detach?: boolean;
    multiline?: boolean;
    "long-args"?: boolean;
    "arg-value-separator"?: ArgValueSeparator;
  };
  export default function decomposerize(
    input: string,
    configuration: Configuration = {}
  ): ?string {}
}
