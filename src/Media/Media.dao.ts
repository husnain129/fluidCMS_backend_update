import { uploadImage, deleteImage } from '../utils/mediaCDN';
import { ISize, IMedia, IMediaReturn } from './Media.interface';
import Media from './Media.schema';
import FluidError from '../FluidError';
import { STATUS } from '../Types/enums'

export let size: ISize = {
	sm: { width: 300 },
	md: { width: 0.5, height: 0.5 },
	raw: {},
	thumb: { width: 192 },
	profile_img: { width: 720 },
};

class MediaDao {
	private static image: { sm: any; md: any; raw: any } = { sm: null, md: null, raw: null };

	static async uploadImage(file: any) {
		try {
			let [sm, md, raw] = await Promise.all([
				uploadImage(size.sm, file.tempFilePath),
				uploadImage(size.md, file.tempFilePath),
				uploadImage(size.raw, file.tempFilePath),
			]);
			this.image = { sm, md, raw };
		} catch (error: any) {
			throw new FluidError(error.message, STATUS.INTERNAL_SERVER_ERROR);
		}

		if (!this.image) throw new FluidError("Error uploading image", STATUS.INTERNAL_SERVER_ERROR);
		let media = new Media({ ...this.image });
		await media.save();
		return media;
	}

	static async updateImage(file: any, cdn_id: string): Promise<IMediaReturn> {
		try {

			let media = await Media.find({});
			let media_id: string = "";

			// THEN FIND THE MEDIA WITH THE ID THAT MATCH WITH CDN_ID

			media.forEach((_m: any) => {
				if (
					_m.sm.cdn_id === cdn_id ||
					_m.md.cdn_id === cdn_id ||
					_m.raw.cdn_id === cdn_id
				) {
					media_id = _m._id;
				}
			});

			if (!media_id) throw new FluidError("Image not found", STATUS.BAD_REQUEST);

			// GET THE MEDIA WITH THE ID

			let current_media = await Media.findById(media_id) as IMedia & { _id: string };

			let cdns: string[] = [];
			cdns.push(current_media!.sm.cdn_id);
			cdns.push(current_media!.md.cdn_id);
			cdns.push(current_media!.raw.cdn_id);

			// THIS PROMISE DELETE ALL THE IMAGES FROM CDN

			await Promise.all([
				deleteImage(cdns[0]),
				deleteImage(cdns[1]),
				deleteImage(cdns[2]),
			]);

			// THIS PROMISE UPLOADS THE NEW IMAGES TO CDN

			try {
				let [sm, md, raw] = await Promise.all([
					uploadImage(size.sm, file.tempFilePath),
					uploadImage(size.md, file.tempFilePath),
					uploadImage(size.raw, file.tempFilePath),
				]);

				current_media.sm = sm;
				current_media.md = md;
				current_media.raw = raw;
				await current_media.save();
				return current_media;

			} catch (err: any) {
				throw new FluidError("something went wrong", STATUS.BAD_REQUEST);
			}
		} catch (err: any) {
			throw new FluidError("something went wrong", STATUS.BAD_REQUEST);
		}
	}

	static async getImage(imageID: string): Promise<IMediaReturn> {
		try {
			let media = await Media.findById(imageID).select("-__v") as IMedia & { _id: string };
			if (!media) throw new FluidError("No media found", STATUS.BAD_REQUEST);
			return media;
		} catch (err: any) {
			throw new FluidError("something went wrong", STATUS.BAD_REQUEST);
		}
	}

}

export default MediaDao;