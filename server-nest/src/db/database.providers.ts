import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { AppliedEvent, Note, SharedNote } from '../notes/note.entity';
import { EventStore } from '../eventstore/eventstore.entity';
import { SEQUELIZE } from './consts';

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            const sequelize = new Sequelize('sqlite::memory:');
            sequelize.addModels([User, Note, SharedNote, AppliedEvent, EventStore]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
