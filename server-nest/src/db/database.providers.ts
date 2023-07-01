import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Note, SharedNote } from '../notes/note.entity';
import { Event } from '../events/event.entity';
import { SEQUELIZE } from './consts';

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize({
                dialect: 'postgres',
                host: configService.get<string>('PG_HOST') ?? 'localhost',
                port: configService.get<number>('PG_PORT') ?? 5432,
                username: configService.get<string>('PG_USERNAME') ?? 'root',
                password: configService.get<string>('PG_PASSWORD') ?? 'password',
                database: configService.get<string>('DB_NAME') ?? 'nest',
            });
            sequelize.addModels([User, Note, SharedNote, Event]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
