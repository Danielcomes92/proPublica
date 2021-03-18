data = data.results[0].members;

const statistics = {
    democrats: {
        members: 0,
        avgVotes: 0
    },
    republicans: {
        members: 0,
        avgVotes: 0
    },
    independants: {
        members: 0,
        avgVotes: 0
    },
    totals: {
        members: 0,
        leastLoyals: [],
        mostLoyals: [],
        mostEngaged: [],
        leastEngaged: []
    }
}

/* STATISTICS CALCULATION */

statistics.democrats.members = countMembers('d');
statistics.democrats.avgVotes = getAvgVotesWithParty('d') / countMembers('d');

statistics.republicans.members = countMembers('r');
statistics.republicans.avgVotes = getAvgVotesWithParty('r') / countMembers('r');

statistics.independants.members = countMembers('id');
statistics.independants.avgVotes = countMembers('id') > 0 ? getAvgVotesWithParty('id') / countMembers('id') : 0;

statistics.totals.members = countMembers('d') + countMembers('r') + countMembers('id');
statistics.totals.leastLoyals = getLeastLoyals();
statistics.totals.mostLoyals = getMostLoyals();
statistics.totals.mostEngaged = getMostEngaged();
statistics.totals.leastEngaged = getLeastEngaged();

/* STATISTICS CALCULATION */

/* FUNCTIONS */

function countMembers(partyAbreviattion) {
    let aux = [];
    data.forEach(member => {
        if((partyAbreviattion).toUpperCase() == member.party) {
            aux.push(member);
        }
    })
    return aux.length;
}

function getAvgVotesWithParty(partyAbreviattion) {
    let aux = [];
    let avgTotal = 0;
    data.forEach(member => {
        if((partyAbreviattion).toUpperCase() == member.party) {
            aux.push(member.votes_with_party_pct);
        }
    })
    aux.forEach(totalPctVotes => {
        avgTotal += totalPctVotes
    })
    return avgTotal;
}

function getLeastLoyals() {
    let auxComp;
    let aux = returnMembers(data);
    aux.sort((a,b) => a.votes_with_party_pct - b.votes_with_party_pct)
    auxComp = Math.ceil((aux.length * 100) / 1000)
    return aux.slice(0, auxComp);
}

function getMostLoyals() {
    let auxComp;
    let aux = returnMembers(data);
    aux.sort((a,b) => b.votes_with_party_pct - a.votes_with_party_pct)
    auxComp = Math.ceil((aux.length * 100) / 1000)
    return aux.slice(0, auxComp);
}

function getLeastEngaged() {
    let auxComp;
    let aux = returnMembers(data);
    aux.sort((a,b) => b.missed_votes_pct - a.missed_votes_pct)
    auxComp = Math.ceil((aux.length * 100) / 1000)
    return aux.slice(0, auxComp);
}

function getMostEngaged() {
    let aux = [];
    let auxComp;
    data.forEach(member => {
        if(member.missed_votes > 0) {
            aux.push(member);
        }
    })
    aux.sort((a,b) => a.missed_votes_pct - b.missed_votes_pct)
    auxComp = Math.ceil((aux.length * 100) / 1000)
    return aux.slice(0, auxComp);
}

function returnMembers(array) {
    let aux = [];
    array.forEach(element => {
        aux.push(element);
    });
    return aux;
}

/* FUNCTIONS */

console.log(statistics)