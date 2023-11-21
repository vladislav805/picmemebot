import type { Bot, User } from '@veluga/telegram';
import type { Storage } from '../utils/Storage';

export interface IContext {
    from: User;
    query: string;
    bot: Bot;
    storage: Storage;
}
