import "reflect-metadata";
import { DataSource } from "typeorm";
import { dbDataSourseOptions } from "../../environment/db";


export const AppDataSource = new DataSource(dbDataSourseOptions);