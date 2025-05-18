// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandName } from './type';
import { PreDefinedEmitters } from './vscode-cmd/emitter';

// let client: TspLanguageClient | undefined;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
let client: any;
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "typespec-azure-vscode" is now active!');
	vscode.window.showInformationMessage('Congratulations, your extension "typespec-azure-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('typespec-azure-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from typespec-azure-vscode!');
	});

	context.subscriptions.push(disposable);
	// vscode.extensions.all.forEach((extension) => {
	// 	if (extension.id === 'microsoft.typespec-azure') {
	// 		vscode.window.showInformationMessage('Typespec Azure extension is installed.');
	// 	}
	// }
	// );
	const typespecExtension = vscode.extensions.getExtension('typespec.typespec-vscode');
	let typespecExtensionApis: any;
	if (typespecExtension) {
		vscode.window.showInformationMessage('Typespec extension is installed.');
		// typespecExtension.activate().then(() => {
		// 	vscode.window.showInformationMessage('Typespec extension is activated.');
		// 	// You can now use the Typespec API
		// 	// For example, you can access the Typespec client
		// 	const typespecClient = typespecExtension.exports;
		// 	if (typespecClient) {
		// 		vscode.window.showInformationMessage('Typespec client is available.');
		// 		// You can now use the Typespec client
		// 		// For example, you can access the Typespec API
		// 		// typespecClient.someMethod();
		// 	}
		// }, (error) => {
		// 	vscode.window.showErrorMessage('Failed to activate Typespec extension: ' + error);
		// });
		
		await typespecExtension.activate();
		typespecExtensionApis = typespecExtension.exports;
		// await client.emitCodeFunc(undefined, PreDefinedEmitters);
	} else {
		vscode.window.showErrorMessage('Typespec extension is not installed. Please install it to use this extension.');
	}
	// vscode.commands.getCommands(true).then((commands) => {
	// 	vscode.window.showInformationMessage('Available commands: ' + commands.join(', '));
	// }
	// );
	// const commands = await vscode.commands.getCommands(true);
	// vscode.window.showInformationMessage('Available commands: ' + commands.join(', '));
	/* emit command. */
	/* reuse the emit code function from typespec extension */
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand(CommandName.EmitCode, async (uri: vscode.Uri) => {
	// 	  await vscode.window.withProgress(
	// 		{
	// 		  location: vscode.ProgressLocation.Window,
	// 		  title: "Emit from TypeSpec Azure...",
	// 		  cancellable: false,
	// 		},
	// 		async () => {
	// 			await typespecExtensionApis.emitCodeFunc(
	// 			PreDefinedEmitters,
	// 			context,
	// 			uri,
	// 			undefined,
	// 		  );
	// 		},
	// 	  );
	// 	}),
	//   );
	/* reuse the emit command from typespec extension*/
	context.subscriptions.push(
		vscode.commands.registerCommand(CommandName.EmitCode, async (uri: vscode.Uri) => {
		  await vscode.window.withProgress(
			{
			  location: vscode.ProgressLocation.Window,
			  title: "Emit from TypeSpec Azure...",
			  cancellable: false,
			},
			async () => {

			  vscode.commands.executeCommand(
				"typespec.emitCode",
				uri,
				PreDefinedEmitters,
			  );
			},
		  );
		}),
	  );
	
	/* start typespec azure language server */
}

// This method is called when your extension is deactivated
export function deactivate() {}
