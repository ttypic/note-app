import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { Note, SharedNote } from '../notes/note.entity';
import { Event } from '../events/event.entity';
import { SEQUELIZE } from './consts';

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            const sequelize = new Sequelize('sqlite::memory:');
            sequelize.addModels([User, Note, SharedNote, Event]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
