import { connect } from 'mongoose';
import { Logger } from './Logger';

export const createDatabaseConnection = async (): Promise<void> => {
    try {
        const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@dev-cluster-bsmvv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
        Logger.info(`Connecting to MongoDB: ${process.env.DB_NAME}`);

        connect(
            uri,
            {
                useCreateIndex: true,
                useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
    } catch (err) {
        Logger.warn(err);
    }
};
