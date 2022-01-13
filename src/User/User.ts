import { NextFunction, Request, Response } from "express";
import FluidError from '../FluidError';
import { STATUS } from '../Types/enums';
import UserService from './User.service';

class User {
	static async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			let _b = req.body;
			const { email, password } = req.body;
			if (!email && !password) throw new FluidError("provide email or password", STATUS.BAD_REQUEST);
			if (password.length < 6) throw new FluidError("Password must be greater than 6 character", STATUS.BAD_REQUEST);
			res.status(STATUS.OK).json({
				ok: true,
				user: await UserService.createUser(_b)
			})
		} catch (err) {
			next(err);
		}
	}

	static async login(req:Request,res:Response,next:NextFunction){
		try{
			const { email, password } = req.body;
			if (!email && !password) throw new FluidError("provide email or password", STATUS.INTERNAL_SERVER_ERROR);
			res.status(STATUS.OK).json({
				user: await UserService.login(email, password)
			})
		}catch(err){
			next(err);
		}
	}
}

export default User;