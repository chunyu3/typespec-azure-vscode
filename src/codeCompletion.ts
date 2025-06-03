import * as vscode from "vscode";
import { TYPESPEC_CODE_COMPLETE_SYSTEM_PROMPT } from "./ai/prompt";
import { readFile } from "fs/promises";
export function registerInlineCodeCompletion(
  vscontext: vscode.ExtensionContext
) {
  const inlineCompletionProvider =
    vscode.languages.registerInlineCompletionItemProvider(
      [{ scheme: "file", language: "typespec" }, ".", " ", "{", "\n"],
      {
        async provideInlineCompletionItems(
          document: vscode.TextDocument,
          position: vscode.Position,
          context: vscode.InlineCompletionContext,
          token: vscode.CancellationToken
        ) {
          const inlineCompletionItems: vscode.InlineCompletionItem[] = [];
          try {
            /* create a new inline completion item */
            let [model] = await vscode.lm.selectChatModels({
              vendor: "copilot",
              family: "gpt-4o"
            });
            // init the chat message
            const fullExampleDoc = await readFile(
              vscontext.asAbsolutePath("src/ai/azure/step05.fullexample.md")
            );
            const exampleMsg = `Following is the basic guidance for defining full example in Azure Service:\n ------------------- \n ${fullExampleDoc} \n ------------------- \n`;
            const prompte = `Here is the current code I'm working on:\n----------------------\n ${document.getText(new vscode.Range(new vscode.Position(0, 0), position))}\n---------------------------\nPlease suggest the next lines of code without repeating the current line.`;
            const messages = [
              vscode.LanguageModelChatMessage.Assistant(
                TYPESPEC_CODE_COMPLETE_SYSTEM_PROMPT
              ),
              vscode.LanguageModelChatMessage.Assistant(exampleMsg),
              // vscode.LanguageModelChatMessage.Assistant(document.getText())
              vscode.LanguageModelChatMessage.User(prompte)
            ];
            // make sure the model is available
            // let suggestion: string | undefined;
            if (model) {
              // send the messages array to the model and get the response
              let chatResponse = await model.sendRequest(
                messages,
                {},
                new vscode.CancellationTokenSource().token
              );
              /* parse the response. */
              const suggestion = await getChatResponse(chatResponse);
              if (suggestion) {
                // suggestion = removeMd(suggestion_raw);
                const completion = new vscode.InlineCompletionItem(suggestion);
                completion.insertText = new vscode.SnippetString(
                  `${suggestion}\n`
                );
                inlineCompletionItems.push(completion);
              }
            }
          } catch (error) {
            console.error("Error providing inline completion items:", error);
          }

          return inlineCompletionItems;
        }
      }
    );
  vscontext.subscriptions.push(inlineCompletionProvider);
}

async function getChatResponse(chatResponse: vscode.LanguageModelChatResponse) {
  // get the text from the chat response
  let response = "";
  for await (const fragment of chatResponse.text) {
    if (fragment) response += fragment;
  }
  return response;
}
