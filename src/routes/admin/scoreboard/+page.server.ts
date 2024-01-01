import { db } from '$lib/server/database';

export const load = async (req: Request, res: Response) => {
	
		try {
			const contestants = await db.contestant.findMany({
				select: {
					id: true,
					name: true,
					image: true,
					votes: true
				}
			});
			return {contestants};
		} catch (error) {
			
		}
}

export const actions = {
	addContestant: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const image = data.get('image');

		//convert image to base64
		const buffer = await image.arrayBuffer();
		const base64 = `data:${image.type};base64,${Buffer.from(buffer).toString('base64')}`;

		//save to database
		const contestant = await db.contestant.create({
			data: {
				name: name,
				image: base64
			}
		});
	},

	deleteContestant: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id'), 10);

		//delete from database
		const contestant = await db.contestant.delete({
			where: {
				id: id
			}
		});
	},

	addVote: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id'), 10);

		//update database
		const contestant = await db.contestant.update({
			where: {
				id: id
			},
			data: {
				votes: {
					increment: 1,
				}
			}
		});

		return { contestant };
	},

	removeVote: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id'), 10);

		//update database
		const contestant = await db.contestant.update({
			where: {
				id: id
			},
			data: {
				votes: {
					decrement: 1,
				}
			}
		});

		return { contestant };
	},
}