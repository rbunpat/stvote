import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const token = cookies.get('token')
    if (!token) {
        throw redirect(302, '/signin')
    }

    const email = jwt.verify(token, import.meta.env.VITE_JWTSECRET).email
    const user = await db.user.findUnique({ where: { email }})
    if (!user) {
        throw redirect(302, '/')
    }
	
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

	logout: ({ cookies }) => {
		// byebye cookie
		cookies.delete('token', { path: '/' })

		// redirect the user
		throw redirect(302, '/')
	},
}