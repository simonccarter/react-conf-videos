import Redis from 'ioredis';
require('dotenv').config();

const client = new Redis(process.env.DBPATH);

client.on("error", function(error) {
  console.error(error);
});

const REDIS_PREFIX = 'local'

const clearAll = async () => {
    const keys = await client.keys(`${REDIS_PREFIX}:*`);
    const pipeline = client.pipeline()
    for(let key of keys){
        pipeline.del(key)
    }

    pipeline.send_command('FT.DROPINDEX', `${REDIS_PREFIX}:idx:conference`)
    pipeline.send_command('FT.DROPINDEX', `${REDIS_PREFIX}:idx:video`)
    
    const result = await pipeline.exec()
    return;
}

const main = async () => {
    console.log('flushing redis')
    await clearAll()

    console.log('disconnecting')
    await client.disconnect()

    return;
}

main();