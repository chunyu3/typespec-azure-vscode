// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CommandName } from "./type.js";
import { PreDefinedEmitters } from "./vscode-cmd/emit-code/emitter.js";
import {
  getEntrypointTspFile,
  TraverseMainTspFileInWorkspace
} from "./typespec-utils.js";
import { registerInlineCodeCompletion } from "./codeCompletion.js";

export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  vscode.window.showInformationMessage(
    'Congratulations, your extension "typespec-azure-vscode" is now active!'
  );
  const typespecExtension = vscode.extensions.getExtension(
    "typespec.typespec-vscode"
  );
  let typespecExtensionApis: any;
  if (typespecExtension) {
    vscode.window.showInformationMessage("Typespec extension is installed.");

    await typespecExtension.activate();
    typespecExtensionApis = typespecExtension.exports;
  } else {
    vscode.window.showErrorMessage(
      "Typespec extension is not installed. Please install it to use this extension."
    );
  }
  /* register azure template. */
  if (typespecExtensionApis) {
    typespecExtensionApis.registerTemplate({
      name: "azure",
      url: "https://aka.ms/typespec/azure-init"
    });
  }
  /* emit command. */
  /* reuse the emit command from typespec extension*/
  context.subscriptions.push(
    vscode.commands.registerCommand(
      CommandName.EmitCode,
      async (uri: vscode.Uri) => {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Window,
            title: "Emit from TypeSpec Azure...",
            cancellable: false
          },
          async () => {
            vscode.commands.executeCommand(
              "typespec.emitCode",
              uri,
              PreDefinedEmitters,
              getEntrypointTspFiles
            );
            /* other operation. */
          }
        );
      }
    )
  );

  /* start typespec azure language server */
  /* register code completion */
  registerInlineCodeCompletion(context);
}

async function getEntrypointTspFiles(
  uri: vscode.Uri
): Promise<string[] | undefined> {
  if (!uri) {
    return await TraverseMainTspFileInWorkspace();
  } else {
    const tspFile = await getEntrypointTspFile(uri.fsPath);
    if (tspFile) {
      return [tspFile];
    } else {
      return undefined;
    }
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
