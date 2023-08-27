import * as crypto from 'crypto'
import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";
import * as chaiAsPromise from 'chai-as-promised'
import nock from 'nock'
import { deployContracts, startServer } from './environment'
import { userService } from '../src/services/UserService'
import { CALLBACK_URL, TWITTER_CLIENT_ID, TWITTER_CLIENT_KEY } from '../src/config'
import { UserRegisterStatus } from '../src/enums/userRegisterStatus'
import { HTTP_SERVER, CLIENT_URL } from './configs'
import { ethers } from 'hardhat'
import { Identity } from '@semaphore-protocol/identity'
import { UserState } from '@unirep/core'
import { Server } from 'http'


chai.use(chaiHttp);

describe('LOGIN /login', () => {
    const TWITTER_API = "https://api.twitter.com"
    const mockState = 'state'
    const mockCode = 'testCode'
    const mockUserId = '123456'
    const wrongCode = "wrong-code"
    const token = btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_KEY}`)
    let userState: UserState
    let app, unirep;
    let db, prover, provider, TransactionManager, synchronizer, server: Server;
    before(async () => {
        // open promise testing 
        chai.use(chaiAsPromise.default);
        // deploy contracts
        ({ unirep, app } = await deployContracts());
        // start server
        ({db, prover, provider, TransactionManager, synchronizer, server} = await startServer(
            unirep, 
            app
        ));
    })

    beforeEach(async () => {
        // mock twitter api behavior
        const accessToken = "test_access_token"
        nock(TWITTER_API, { "encodedQueryParams": true })
            .post('/2/oauth2/token')
            .query(true)  // Match any query parameters
            .matchHeader('content-type', 'application/x-www-form-urlencoded')
            .matchHeader('authorization', `Basic ${token}`)
            .reply((uri, requestBody, cb) => {
                // Parse the query parameters from the URI
                const url = new URL(uri, TWITTER_API);
                const code = url.searchParams.get('code');

                // Conditionally reply based on the 'code' query parameter
                if (code === wrongCode) {
                    cb(null, [400, {
                        "error": "invalid_request",
                        "error_description": "Value passed for the authorization code was invalid."
                    }]);
                } else if (code === mockCode) {
                    cb(null, [200, {
                        "token_type": "bearer",
                        "refresh_token": 'mock-refresh-token',
                        "access_token": accessToken
                    }]);
                } else {
                    cb(null, [404, { "error": "code not found" }]);
                }
            });
        nock(TWITTER_API)
            .post('/2/oauth2/token')
            .query({
                client_id: TWITTER_CLIENT_ID,
                grant_type: 'refresh_token',
                refresh_token: 'mock-refresh-token'
            })
            .matchHeader('Content-type', 'application/x-www-form-urlencoded')
            .matchHeader('Authorization', `Basic ${token}`)
            .reply(200, {
                "access_token": accessToken
            });
        nock(TWITTER_API, { "encodedQueryParams": true })
            .get('/2/users/me')
            .matchHeader('Authorization', `Bearer ${accessToken}`)
            .reply(200, {
                "data": {
                    "id": mockUserId,
                    "name": "SocialTWDev",
                    "username": "SocialTWDev"
                }
            });
    })

    it('/api/login should return url', async () => {
        chai.request(`${HTTP_SERVER}`)
            .get('/api/login')
            .end((err, res) => {
                expect(res.status).equal(200)
            })
    })

    it('/api/user should init user', async () => {
        nock(`${CLIENT_URL}?code=${mockUserId}&status=${UserRegisterStatus.INIT}`)
        chai.request(`${HTTP_SERVER}`)
            .get('/api/user')
            .set('content-type', 'application/json')
            .query({
                state: mockState,
                code: mockCode,
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
            })
    })

    it('/api/user should not init user with wrong code and return error', async () => {
        // Suppress console.error and restore original console.error
        const originalConsoleError = console.error;
        console.log = console.error = console.warn = () => {};
        await expect(userService.loginOrInitUser(mockState, wrongCode))
            .to.be.rejectedWith(`Error in login`)
        console.error = originalConsoleError;
    })

    it('loginOrInitUser should properly init user', async () => {
        
        try {

            const user = await userService.loginOrInitUser(mockState, mockCode)
            
            // expected
            const hash = crypto.createHash('sha3-224')
            const expectedUserId = `0x${hash.update(mockUserId).digest('hex')}`
            expect(user.hashUserId).equal(expectedUserId)
            expect(user.status).equal(UserRegisterStatus.INIT)
            expect(user.signMsg).equal(undefined)
        } catch (error) {
            console.log(error)
        }
    })

    /* it('/api/signup, user should sign up with wallet', async () => {
        // TODO: encapsulate below to a function within original code
        var initUser = await userService.getLoginOrInitUser('123')
        const wallet = ethers.Wallet.createRandom()
        const signature = await wallet.signMessage(initUser.hashUserId)
        const identity = new Identity(signature)
        userState = new UserState({
            db,
            provider,
            prover,
            unirepAddress: unirep.address,
            attesterId: BigInt(app.address),
            id: identity,
        })

        await userState.sync.start()
        await userState.waitForSync()

        const signupProof = await userState.genUserSignUpProof()
        var publicSignals = signupProof.publicSignals.map((n) => n.toString())

        chai.request(`${HTTP_SERVER}`)
        .get('/api/signup')
        .set('content-type', 'application/json')
        .query({
            publicSignals: publicSignals,
            proof: signupProof,
            hashUserId: mockUserId,
            fromServer: false,
        })
        .end((err, res) => {
            console.log(res, err)
            expect(res).to.have.status(200)
        })
    }) 
    it('/api/signup, user should sign up with server', async () => {
    })  */
   

    /* it('/api/signup, user should not sign up with wrong proof and return error', async () => {
        // TODO: encapsulate below to a function within original code
        var initUser = await userService.getLoginOrInitUser('1234')
        const wallet = ethers.Wallet.createRandom()
        const signature = await wallet.signMessage(initUser.hashUserId)
        const identity = new Identity(signature)
        userState = new UserState({
            db,
            provider,
            prover,
            unirepAddress: unirep.address,
            attesterId: BigInt(app.address),
            id: identity,
        })

        await userState.sync.start()
        await userState.waitForSync()

        let wrongSignupProof = await userState.genUserSignUpProof()
        let publicSignals = wrongSignupProof.publicSignals.map((n) => n.toString())
        wrongSignupProof.identityCommitment = BigInt(0)

        chai.request(`${HTTP_SERVER}`)
        .get('/api/signup')
        .set('content-type', 'application/json')
        .query({
            publicSignals: publicSignals,
            proof: wrongSignupProof,
            hashUserId: mockUserId,
            fromServer: false,
        })
        .end((err, res) => {
            expect(err).to.exist;
            expect(err.status).to.equal(500);
        })
    })
 */
    /* it('/api/signup handle duplicate signup', async () => {
        
    }) 
    
    it('/api/identity', async () => {
    })

    it('/api/identity', async () => {
    })
    
    it('loginStatus', async () => {
    })
    
    */



    // TODO
    //it('should post failed with wrong proof', async () => {})

    after(async () => {
        server.close()
    })
})
