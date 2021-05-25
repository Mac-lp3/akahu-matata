import { FileDao } from '../src/io/fileDao';
import { buildAllAccountConfigs } from '../src/io/akahu';

describe('the akahu API callers', function() {

    const dao = new FileDao();

    it('loads?', async function() {
        const u = await dao.getUser('123');
        console.log(u);
    })
})