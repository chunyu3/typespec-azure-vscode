export enum EmitterKind {
    Schema = "openapi",
    Client = "client",
    Server = "server",
    Unknown = "unknown",
  }
  
  export interface Emitter {
    language: string;
    package: string;
    version?: string;
    sourceRepo?: string;
    requisites?: string[];
    kind: EmitterKind;
  }

// TODO: remove this when we can load default emitters from the compiler
export const PreDefinedEmitters: ReadonlyArray<Emitter> = [
    {
      language: ".NET",
      package: "@azure-tools/typespec-csharp",
      sourceRepo: "https://github.com/Azure/autorest.csharp",
      requisites: [".NET 8.0 SDK"],
      kind: EmitterKind.Client,
    },
    {
      language: "Java",
      package: "@typespec/http-client-java",
      sourceRepo: "https://github.com/microsoft/typespec/tree/main/packages/http-client-java",
      requisites: ["Java 17 or above", "Maven"],
      kind: EmitterKind.Client,
    },
    {
      language: "JavaScript",
      package: "@typespec/http-client-js",
      sourceRepo: "https://github.com/microsoft/typespec/tree/main/packages/http-client-js",
      kind: EmitterKind.Client,
    },
    {
      language: "Python",
      package: "@typespec/http-client-python",
      sourceRepo: "https://github.com/microsoft/typespec/tree/main/packages/http-client-python",
      kind: EmitterKind.Client,
    },
    {
      language: ".NET",
      package: "@typespec/http-server-csharp",
      sourceRepo: "https://github.com/microsoft/typespec/tree/main/packages/http-server-csharp",
      kind: EmitterKind.Server,
    },
    {
      language: "JavaScript",
      package: "@typespec/http-server-js",
      sourceRepo: "https://github.com/microsoft/typespec/tree/main/packages/http-server-js",
      kind: EmitterKind.Server,
    },
    {
      language: "OpenAPI3",
      package: "@typespec/openapi3",
      sourceRepo: "https://github.com/microsoft/typespec/tree/main/packages/openapi3",
      kind: EmitterKind.Schema,
    },
  ];