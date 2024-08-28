import { Not } from "typeorm";
import { AppDataSource } from "../data/data-sourse/data-sourse"
import { DuplicateEmailFailure } from "../entity/failures/duplicate-email";
import { Failure } from "../entity/failures/failure";
import { UserEntity } from "../entity/user-entity"
import { Either, Left, Right } from "../utils/either";


export type UserServiceParams = {
    notifyNewUserWasCreated: (userId:number)=>void
}

export class UserService{
    constructor(private readonly params:UserServiceParams){}

    private readonly _userTypeormRepo = AppDataSource.getRepository(UserEntity);

    async updateUser(userId:number, updateData: Partial<Record<keyof UserEntity, any>>): Promise<void>{
        await AppDataSource.manager.update(UserEntity, userId, updateData);
    }

    async saveUser(user:UserEntity): Promise<Either<DuplicateEmailFailure | Failure, UserEntity>>{
        try {
            user = Object.assign(new UserEntity(), user);
            user = await this._userTypeormRepo.save(user);
            this.params.notifyNewUserWasCreated(user.userId);
            return Right.create(user);
        } catch (error) {
            if(error.code == "ER_DUP_ENTRY"){
                return Left.create(new DuplicateEmailFailure(user.email))
            }else if(error.code?.lenth){
                throw `TODO: ${error.code}`
            }
            console.log('saveuser error', error.toString());
            return Left.create(new Failure());
        }
    }

    async getAllUsers(params?: {exceptUserId:number}):Promise<UserEntity[]>{
        if(params?.exceptUserId == null) return this._userTypeormRepo.find();

        return this._userTypeormRepo.find({where:{
            userId: Not(params.exceptUserId)
        }})
    }

    getUserByEmail(email:string):Promise<UserEntity>{
        return this._userTypeormRepo.findOneBy({email});
    }

    getUserById(id:number):Promise<UserEntity>{
        return this._userTypeormRepo.findOneBy({userId:id});
    }
}