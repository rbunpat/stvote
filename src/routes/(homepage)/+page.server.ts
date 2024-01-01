import { db } from '$lib/server/database'
export const load = async (req: Request, res: Response) => {

	try {
		const contestants = await db.contestant.findMany({
			select: {
				name: true,
				image: true,
				votes: true
			}
		});
		return {contestants};
	} catch (error) {
		
	}

}