import {UserController} from "../controllers/user-controller/user-controller";
import {AuthController} from "../controllers/user-controller/auth-controller/auth-controller";
import {AuthService} from "../service/auth-service";
import {UserService} from "../service/user-service";
import {AsklessServer} from "askless";

export interface Controller {
    initializeRoutes (server: AsklessServer) : void;
}

let _usersService:UserService;
let _authService:AuthService;
let _authController:AuthController;
let _controllers:Array<Controller>;

export const controllers = () => _controllers;

export function initializeControllers (server:AsklessServer) {
    _controllers = [
        new UserController(params => _usersService = new UserService(params)),
        _authController = new AuthController(_authService = new AuthService(_usersService, server)),
    ];
    return _controllers;
}

export function authController() { return _authController; }
export function authService() { return _authService; }
export function usersService() { return _usersService; }
