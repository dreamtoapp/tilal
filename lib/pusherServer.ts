import PusherServer from 'pusher';

const { PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_KEY, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_CLUSTER } =
  process.env;

if (!PUSHER_APP_ID || !NEXT_PUBLIC_PUSHER_KEY || !PUSHER_SECRET || !NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('Missing required Pusher environment variables.');
}

export const pusherServer = new PusherServer({
  appId: PUSHER_APP_ID,
  key: NEXT_PUBLIC_PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

// import PusherServer from 'pusher';

// export const pusherServer = new PusherServer({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
// });
