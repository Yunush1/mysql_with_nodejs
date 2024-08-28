import "reflect-metadata"
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";
import { UserEntity } from "../entity/user-entity"

export const dbDataSourseOptions :DataSourceOptions={
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "alpha_servicec",
    synchronize: true,
    logging: false,
    entities: [UserEntity],
    migrations: [],
    subscribers: [],
}
