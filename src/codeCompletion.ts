import * as vscode from "vscode";
export function registerInlineCodeCompletion(context: vscode.ExtensionContext) {
  const inlineCompletionProvider =
    vscode.languages.registerInlineCompletionItemProvider(
      { scheme: "file", language: "typespec" },
      {
        async provideInlineCompletionItems(
          document: vscode.TextDocument,
          position: vscode.Position,
          context: vscode.InlineCompletionContext,
          token: vscode.CancellationToken
        ) {
          const inlineCompletionItems: vscode.InlineCompletionItem[] = [];
          return inlineCompletionItems;
        }
      }
    );
  context.subscriptions.push(inlineCompletionProvider);
}
