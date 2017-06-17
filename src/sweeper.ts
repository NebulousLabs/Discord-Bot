import { SweeperClient } from './util/lib/SweeperClient';

const client: SweeperClient = new SweeperClient();

client.start();

client.once('clientReady', () => {
	// client.user.setAvatar('./img/avatar.jpeg');
});

client.on('disconnect', () => process.exit(100));
