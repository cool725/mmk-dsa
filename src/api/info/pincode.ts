import { api } from '..';

const PINCODE_DETAIL_ENDPOINT = 'custom/manager/customers/pin/';
const PINCODE_SEARCH_ENDPOINT = 'custom/user/pincodes/';

export async function getPinCodeDetail(pincode: string) {
    try {
        const { data } = await api.axios.get(`${PINCODE_DETAIL_ENDPOINT}${pincode}`);
        return data.data;
    } catch (error) {
        console.error(`pincode api`, error);
    }
    return null;
}

export async function getPinCodeList(searchString: string) {
    try {
        const { data } = await api.axios.get(`${PINCODE_SEARCH_ENDPOINT}${searchString}`);
        return data.data;
    } catch (error) {
        console.error(`pincode search api`, error);
    }
    return null;
}
