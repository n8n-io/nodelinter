import inquirer from "inquirer";

export class Prompter {
  public async askForPrintName() {
    return await inquirer
      .prompt<{
        printName: string;
      }>([
        {
          name: "printName",
          type: "input",
          message: "Name of the logs file to print, e.g. `myLogs`",
        },
      ])
      .then(({ printName }) => printName);
  }
}
