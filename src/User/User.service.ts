import { IUserBody } from './User.interface';
import UserDao from './User.dao';
class UserService{
	static async createUser(_b:IUserBody){
		return await UserDao.createUser(_b);
	}

	static async login(email: string,password:string){
		return await UserDao.login(email,password)
	}

	static async updateUser(userID: string, first_name: string, last_name: string){
		return await UserDao.updateUser(userID,first_name,last_name);
	}

	static async updatePassword(userID:string,password:string,newPassword:string){
		return await UserDao.updatePassword(userID, password, newPassword);
	}

	static async postUserImage(userID:string,file:any){
		return await UserDao.postUserImage(userID,file);
	}
}

export default UserService;