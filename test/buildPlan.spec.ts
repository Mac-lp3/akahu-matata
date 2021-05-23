import { b_u_b_r, e_u_b_r } from './data/resolvable';
import { cascade, getAccountRequests } from '../src/core/buildPlan';

describe('core logic', function() {
    
    it('solves b_u_b_r', function() {
        /**
         * Expect:
         * T1b -> T2u until T1b is @ min. 
         *   Still under? T3b -> T2u until T3b is @ min
         */

        const xfrs = getAccountRequests(b_u_b_r)

        console.log(xfrs)

        console.log(cascade(xfrs));

        console.log(xfrs)

        // console.log(cascadeFrom(xfrs, { from: 'excess', to: 'under' }), xfrs)

    })

})