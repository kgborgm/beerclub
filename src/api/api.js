import axios from 'axios';

export async function getMembers() {
    return await axios.get("http://localhost:3000/api/members")
        .then(res => res.data)
        .catch(e => console.log(e));
}

export async function getBeerStyles(member) {
    return await axios.get("http://localhost:3000/api/beers/" + member)
        .then(res => res.data)
        .catch(e => console.log(e));
}

export async function getConsumptions(member, beer) {
    return await axios.get("http://localhost:3000/api/consumptions/" + member + "/" + beer)
        .then(res => res.data)
        .catch(e => console.log(e));
}