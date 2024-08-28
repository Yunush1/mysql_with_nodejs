import { AsklessServer } from "askless"
import { AppDataSource } from "./data/data-sourse/data-sourse"
import { UserEntity } from "./entity/user-entity"
import { verifyJwtAccessToken } from "./utils/jwt-utils";
import { controllers, initializeControllers } from "./domain/controllers-and-serice";

AppDataSource.initialize().then(async () => {

    const server = new AsklessServer<string>();
    const ports = 3000;
    
    initializeControllers(server);

    // initializing all controllersAndServices
    for (let controller of controllers()) {
        controller.initializeRoutes(server);
    }

    server.init({
        wsOptions:{port:ports},
        debugLogs:false,
        sendInternalErrorsToClient:true,
        requestTimeoutInMs:7*1000,
        authenticate: async (credential, accept, reject):Promise<void> =>{
            if(credential ?? credential['accessToken']){
                const result = verifyJwtAccessToken(credential['accessToken']);
                if(!result.valid) return reject({credentialErrorCode:"EXPIRED_ACCESS_TOKEN"});
                return accept.asAuthenticatedUser({userId:result.userId});
            }
            reject({credentialErrorCode:"MISSING_CREDENTIAL"});
        }
    });
    
    server.start();
    // console.log("started server on "+server.allRoutes.map((item, index)=>console.log(item.route+" number "+index)));
    console.log("started server on "+`http://localhost:${ports}`);

}).catch(error => console.log(error.message))
