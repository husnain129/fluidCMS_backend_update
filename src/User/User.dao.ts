import { IUserReturn, IUserBody } from './User.interface';
import FluidError from '../FluidError';
import User from './User.schema'
import { STATUS } from '../Types/enums'
import generateJWTToken from '../utils/generateJWTToken';
import mongoose from 'mongoose';
import { uploadImage, deleteImage } from '../utils/mediaCDN';
import { ISize } from '../Media/Media.interface';

export let size: ISize = {
	sm: { width: 300 },
	md: { width: 0.5, height: 0.5 },
	raw: {},
	thumb: { width: 192 },
	profile_img: { width: 720 },
};

class UserDao {
	static async createUser(_b: IUserBody): Promise<IUserReturn> {
		try {
			let { email, password, first_name, last_name, profile } = _b;
			if (await User.findOne({ email })) throw new FluidError("User Exist", STATUS.BAD_REQUEST);
			const user = new User({
				first_name,
				last_name,
				email,
				password,
				profile,
			});
			await user.save();
			let token: string = generateJWTToken(user!._id);
			return {
				_id: user._id,
				first_name: user.first_name,
				last_name: user.last_name,
				profile: user.profile,
				created_at: user.created_at.toISOString(),
				token: token
			}
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async login(email: string, password: string): Promise<Partial<IUserReturn>> {
		try {
			const user = (await User.findOne({ email }).select(
				"+password"
			));
			if (!user) throw new FluidError("User not found", STATUS.BAD_REQUEST);
			let isMatch: boolean = false;
			if (password) {
				isMatch = await user!.matchPassword(password, user!.password);
			}

			if (!isMatch) throw new FluidError("Invalid email or password.", STATUS.BAD_REQUEST);
			const token: string = generateJWTToken(user!._id);
			return {
				_id: user!._id,
				first_name: user!.first_name,
				last_name: user!.last_name,
				profile: user!.profile,
				token,
			}
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async updateUser(userID: string, first_name: string, last_name: string) {
		try {
			const user = await User.findById(userID);
			if (first_name) user!.first_name = first_name;
			if (last_name) user!.last_name = last_name;
			await user!.save();
			return "User Updated";
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async updatePassword(userID: string, password: string, newPassword: string) {
		try {
			const user = (await User.findById(userID).select("+password"));
			if (!password && !newPassword) throw new FluidError("Please provide password or confirmPassword.", STATUS.BAD_REQUEST);
			if (!user) throw new FluidError("User not found.", STATUS.BAD_REQUEST);
			if (!(await user.matchPassword(password, user.password))) throw new FluidError("Password not match.", STATUS.BAD_REQUEST);

			if (newPassword.length < 6) throw new FluidError("Password length > 6", STATUS.BAD_REQUEST);
			user.password = newPassword;
			await user.save();
			return "Password Updated";

		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async postUserImage(userID:string,file:any){
		try{	
			const user = await User.findById(userID);
			if (!user) throw new FluidError("User not found.",STATUS.BAD_REQUEST);

	    let image: { thumb: any; profile_img: any } = {
	      thumb: null,
	      profile_img: null,
	    };

			let [thumb, profile_img] = await Promise.all([
				uploadImage(size.thumb, file.tempFilePath),
				uploadImage(size.profile_img, file.tempFilePath),
			]);

			image = { thumb, profile_img };

			user.profile = image;
			await user.save();
			return {profile: user.profile}
		}catch(err:any){
			throw new FluidError("something went wrong",STATUS.INTERNAL_SERVER_ERROR);
		}
	}
}


export default UserDao;