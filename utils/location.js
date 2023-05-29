import geoip from 'geoip-lite';
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';
export const getLocation = async () => {
    const ip = await publicIpv4();
    const location = await geoip.lookup(ip);
    return location;
}
// (async ()=>{
//     console.log(await getLocation());
// })();
