import { HookService, Hook } from '../../../../src/domain/Hook';
import { SessionService } from '../../../../src/domain/Session';

describe('Hook service integration tests', () => {
    it('should execute a hook and save the given data', async () => {
        const hookConfig: Hook = {
            request: {
                method: 'GET',
                url: 'https://jsonplaceholder.typicode.com/comments?postId=1',
            },
            save: {
                server: 'headers.server',
                firstUserEmail: 'body.0.email',
            },
        };

        await HookService.execute(hookConfig);
        expect(SessionService.getFromSession('server')).toEqual('cloudflare');
        expect(SessionService.getFromSession('firstUserEmail')).toEqual(
            'Eliseo@gardner.biz',
        );
    });
});
