import { Command, CommanderStatic } from 'commander';
import { ICommandInput } from '../interfaces';
import { AbstractCommand } from './abstract.command';
import { green } from '@angular-devkit/core/src/terminal';

export class NewCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('new [name]')
      .alias('n')
      .description('Generate a new Riba application')
      .option('-d, --dry-run', 'Allow to test changes before execute command.')
      .option('-g, --skip-git', 'Allow to skip git repository initialization.')
      .option('-s, --skip-install', 'Allow to skip package installation.')
      .option(
        '-p, --package-manager [package-manager]',
        'Allow to specify package manager to skip package-manager selection.',
      )
      .option('-l, --language [language]', 'Specify ts or js language to use')
      .option(
        '-c, --collection [collectionName]',
        'Specify the Collection that shall be used.',
      )
      .action(async (name: string, command: Command) => {
        const options: ICommandInput[] = [];
        options.push({ name: 'dry-run', value: !!command.dryRun });
        options.push({ name: 'skip-git', value: !!command.skipGit });
        options.push({ name: 'skip-install', value: !!command.skipInstall });
        options.push({
          name: 'package-manager',
          value: command.packageManager,
        });
        options.push({
          name: 'language',
          value: !!command.language ? command.language : 'ts',
        });
        options.push({
          name: 'collection',
          value: command.collection,
        });

        const inputs: ICommandInput[] = [];
        inputs.push({ name: 'name', value: name });

        await this.action.handle(inputs, options);
      });
  }
}green