import { Document } from 'mongoose';

interface IMediaObj{
	url:string,
	cdn_id:string
}

export interface IMedia extends Document{
	sm:IMediaObj,
	md:IMediaObj,
	raw:IMediaObj
} 


export interface ISize {
	sm: { width: number; height?: number };
	md: { width: number; height: number };
	raw: Object;
	thumb: { width: number };
	profile_img: { width: number };
}

export interface IMediaReturn {
	_id:string,
	sm: IMedia["sm"],
	md: IMedia["md"],
	raw: IMedia["raw"],
}