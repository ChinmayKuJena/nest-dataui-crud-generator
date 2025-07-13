import inquirer from "inquirer";
import path from "path";
import { ensureDirExists, writeFileSafe } from "../utils/files";

export async function handleCrudCommand() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "entityPath",
      message: "What is your entity file name? (e.g., src/_core/user.entity)",
    },
    {
      type: "input",
      name: "entityName",
      message: "What is your entity class name? (e.g., UserEntity)",
    },
    {
      type: "input",
      name: "routeName",
      message: "What should be the route / module name? (e.g., users-master)",
    },
    {
      type: "input",
      name: "pkName",
      message: "What is your primary key field name? (e.g., user_id)",
      default: "id",
    },
  ]);

  const { entityPath, entityName, routeName, pkName } = answers;
  const pascalName = entityName;
  console.log(answers);
  
  const serviceClassName = `${pascalName}Service`;
  const controllerClassName = `${pascalName}Controller`;
  const moduleClassName = `${pascalName}Module`;

  const folderPath = path.join("src", routeName);
  const servicesPath = path.join(folderPath, "services");

  ensureDirExists(servicesPath);

  // Templates
  const serviceContent = `
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ${pascalName} } from '${entityPath}';
import { Repository } from 'typeorm';

@Injectable()
export class ${serviceClassName} extends TypeOrmCrudService<${pascalName}> {
  constructor(@InjectRepository(${pascalName}) private _repo: Repository<${pascalName}>) {
    super(_repo);
  }
}
`.trim();

  const controllerContent = `
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { ${pascalName} } from '${entityPath}';
import { ${serviceClassName} } from './services/${routeName}.service';
// import ApplyCrudTenantFilter from 'src/_core/decorators/crud-tenant.decorator';

@Crud({
  model: {
    type: ${pascalName},
  },
  params: {
    ${pkName}: {
      field: '${pkName}',
      primary: true,
      type: 'number',
    },
  },
  // add interceptor if needed
})
// @ApplyCrudTenantFilter()
@Controller('${routeName}')
export class ${controllerClassName} implements CrudController<${pascalName}> {
  constructor(public service: ${serviceClassName}) {}
}
`.trim();

  const moduleContent = `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${pascalName} } from '${entityPath}';
import { ${controllerClassName} } from './${routeName}.controller';
import { ${serviceClassName} } from './services/${routeName}.service';

@Module({
  imports: [TypeOrmModule.forFeature([${pascalName}])],
  controllers: [${controllerClassName}],
  providers: [${serviceClassName}],
})
export class ${moduleClassName} {}
`.trim();

  // Write files
  writeFileSafe(path.join(servicesPath, `${routeName}.service.ts`), serviceContent);
  writeFileSafe(path.join(folderPath, `${routeName}.controller.ts`), controllerContent);
  writeFileSafe(path.join(folderPath, `${routeName}.module.ts`), moduleContent);

  console.log(`\n👉 Don't forget to import '${moduleClassName}' into your app.module.ts!`);
}