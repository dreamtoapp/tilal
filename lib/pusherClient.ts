export async function getPusherClient() {
  if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
    throw new Error('Missing required Pusher environment variables.');
  }
  const Pusher = (await import('pusher-js')).default;
  return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });
}
