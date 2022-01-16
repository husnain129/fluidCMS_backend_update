import MediaDao from './Media.dao'

class MediaService{
	static async uploadImage(file:any){
		return await MediaDao.uploadImage(file);
	}

	static async updateImage(file: string, cdn_id: string) {
		return await MediaDao.updateImage(file,cdn_id);
	}
	static async getImage(imageID: string) {
		return await MediaDao.getImage(imageID);
	}
}

export default MediaService;