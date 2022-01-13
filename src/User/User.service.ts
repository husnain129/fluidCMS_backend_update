import { IUserBody } from './User.interface';
import UserDao from './User.dao';
class UserService{
	static async createUser(_b:IUserBody){
		return await UserDao.createUser(_b);
	}

	static async login(email: string,password:string){
		return await UserDao.login(email,password)
	}

}

export default UserService;