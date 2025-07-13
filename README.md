# nest-dataui-crud-generator

A CLI tool to generate NestJS CRUD modules using [`@dataui/crud`](https://github.com/dataui/crud).

## Features

- Quickly scaffold NestJS CRUD controllers, services, and modules
- Uses [`@dataui/crud`](https://github.com/dataui/crud) and TypeORM
- Interactive prompts for entity and route details
- Prevents overwriting existing files

## Installation

```sh
npm install -g @chinmay20409/nest-dataui-crud-generator
```

## Usage

Navigate to your NestJS project root and run:

```sh
nest-crud crud
```

You will be prompted for:

- **Entity file name** (e.g., `src/_core/user.entity`)
- **Entity class name** (e.g., `UserEntity`)
- **Route/module name** (e.g., `users-master`)
- **Primary key field name** (default: `id`)

Example session:

```
$ nest-crud crud
? What is your entity file name? (e.g., src/_core/user.entity) src/_core/user.entity
? What is your entity class name? (e.g., UserEntity) UserEntity
? What should be the route / module name? (e.g., users-master) users
? What is your primary key field name? (e.g., user_id) user_id
```

This will generate:

- `src/users/services/users.service.ts`
- `src/users/users.controller.ts`
- `src/users/users.module.ts`

## Example Generated Service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserEntity } from 'src/_core/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserEntityService extends TypeOrmCrudService<UserEntity> {
  constructor(@InjectRepository(UserEntity) private _repo: Repository<UserEntity>) {
    super(_repo);
  }
}
```

## Notes

- The generated module must be imported into your `app.module.ts`.
- Existing files will not be overwritten.