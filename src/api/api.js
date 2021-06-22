import axios from 'axios';

/**
 * getMembers
 * @returns all member objects in the database
 */
export async function getMembers() {
    return await axios.get("http://localhost:3000/api/members")
        .then(res => res.data)
        .catch(e => console.error(e));
}

/**
 * getBeerStyles
 * @param {*} member 
 * @returns list of all beers for that member
 */
export async function getBeerStyles(member) {
    return await axios.get("http://localhost:3000/api/beers/" + member)
        .then(res => res.data)
        .catch(e => console.error(e));
}

/**
 * 
 * @param {getConsumptions} member 
 * @param {*} beer 
 * @returns filtered list of beers for that member organized by beer style
 */
export async function getConsumptions(member, beer) {
    return await axios.get("http://localhost:3000/api/consumptions/" + member + "/" + beer)
        .then(res => res.data)
        .catch(e => console.error(e));
}