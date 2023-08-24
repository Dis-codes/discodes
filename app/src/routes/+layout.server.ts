import { user } from '../lib/stores';


export const load = async ({ locals: { getSession } }) => {
    const session = await getSession();
    if (session) {
        user.set(session.user);
    }
    return {
        session: await getSession(),
    }
}