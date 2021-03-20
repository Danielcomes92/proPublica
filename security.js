data = data.results[0].members;

const select = document.querySelector('#selectStates');

//TABLES
const tbodyGeneral = document.querySelector('#senate-data');
const tbodyTopTable = document.querySelector('#topTable');
const tbodyLeastEngaged = document.querySelector('#leastEngaged');
const tbodyMostEngaged = document.querySelector('#mostEngaged');
const tbodyLeastLoyal = document.querySelector('#leastLoyal');
const tbodyMostLoyal = document.querySelector('#mostLoyal');

//PAGES
const attendancePage = document.title.includes('Attendance');
const loyaltyPage = document.title.includes('Loyalty');
const generalPage = document.title.includes('General');

const statistics = {
    totals: {
        leastLoyals: [],
        mostLoyals: [],
        mostEngaged: [],
        leastEngaged: [],
    },
    parties: [
        {
            name: 'Democrats',
            members: 0,
            avgVotes: 0
        },
        {
            name: 'Republicans',
            members: 0,
            avgVotes: 0
        },
        {
            name: 'Independant',
            members: 0,
            avgVotes: 0
        },
        {
            name: 'Total',
            members: countMembers('d') + countMembers('r') + countMembers('id'),
            avgVotes: ''
        }
    ]
};

const partiesArray = statistics.parties;

/* STATISTICS CALCULATIONS */
statistics.totals.leastLoyals = getLeastLoyals();
statistics.totals.mostLoyals = getMostLoyals();
statistics.totals.mostEngaged = getMostEngaged();
statistics.totals.leastEngaged = getLeastEngaged();

statistics.parties[0].members = countMembers('d');
statistics.parties[0].avgVotes = getAvgVotesWithParty('d');

statistics.parties[1].members = countMembers('r');
statistics.parties[1].avgVotes = getAvgVotesWithParty('r');

statistics.parties[2].members = countMembers('id');
statistics.parties[2].avgVotes = countMembers('id') > 0 ? getAvgVotesWithParty('id') : 0;
/* STATISTICS CALCULATION */

/* STATISTICS FUNCTIONS */
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
    let avgTotal = 0;
    data.forEach(member => {
        if((partyAbreviattion).toUpperCase() == member.party) {
            avgTotal += member.votes_with_party_pct;
        }
    })
    return avgTotal / countMembers(partyAbreviattion);
}

function getLeastLoyals() {
    let aux = [];
    let auxComp;
    data.forEach(member => {
        if(member.total_votes > 0) {
            aux.push(member);
        }
    })
    aux.sort((a,b) => a.votes_with_party_pct - b.votes_with_party_pct)
    auxComp = Math.ceil(aux.length * 0.10)
    return aux.slice(0, auxComp);
}

function getMostLoyals() {  
    let auxComp;
    let aux = returnMembers(data);
    aux.sort((a,b) => b.votes_with_party_pct - a.votes_with_party_pct)
    auxComp = Math.ceil(aux.length * 0.10)
    return aux.slice(0, auxComp);
}

function getLeastEngaged() {
    let auxComp;
    let aux = returnMembers(data);
    aux.sort((a,b) => b.missed_votes_pct - a.missed_votes_pct)
    auxComp = Math.ceil(aux.length * 0.10)
    return aux.slice(0, auxComp);
}

function getMostEngaged() {
    let aux = [];
    let auxComp;
    data.forEach(member => {
            aux.push(member);
    })
    aux.sort((a,b) => a.missed_votes_pct - b.missed_votes_pct)
    auxComp = Math.ceil(aux.length * 0.10)
    let auxFiltered = aux.filter(member => member.total_votes > 0); 
    return auxFiltered.slice(0, auxComp);   
}

function returnMembers(array) {
    let aux = [];
    array.forEach(element => {
        aux.push(element);
    });
    return aux;
}
/* STATISTICS FUNCTIONS */

/* RENDER TABLES */
function insertGeneralTable() {
    tbodyGeneral.innerHTML = '';
    let checkboxGroup = Array.from(document.querySelectorAll('input[name=filterCheck]:checked')).map(el => el.value);
    let stateValue = select.value;
    data.forEach(member => {
        if (checkboxGroup.includes(member.party) && ((stateValue == member.state) || (stateValue == "All States"))) {

            const tr = document.createElement('tr');
            
            let tdFullName = document.createElement('td');
            let tdParty = document.createElement('td');
            let tdState = document.createElement('td');
            let tdSeniority = document.createElement('td');
            let tdVotesWithParty = document.createElement('td');
            
            let middleName = member.middle_name || '';

            tdFullName.innerHTML = `<a href="${member.url}" target="_blank"> ${member.last_name}, ${member.first_name} ${middleName} </a>`;
            tdParty.textContent = member.party;
            tdState.textContent = member.state;
            tdSeniority.textContent = member.seniority;
            tdVotesWithParty.textContent = member.votes_with_party_pct || 0;
            
            tr.appendChild(tdFullName)
            tr.appendChild(tdParty)
            tr.appendChild(tdState)
            tr.appendChild(tdSeniority)
            tr.appendChild(tdVotesWithParty)
    
            tbodyGeneral.appendChild(tr);
        }
    });
}
if(generalPage) {
    insertGeneralTable();
    
    let statesAux = [];
    data.forEach(stateMember => {
        if(statesAux.indexOf(stateMember.state) == -1) {
            statesAux.push(stateMember.state)
        }
    });
    
    statesAux.sort();
    statesAux.forEach(state => {
        option = document.createElement('option');
        option.value = state;
        option.text = state;
        select.appendChild(option)
    });
}

if(attendancePage) {
    insertEngagedmentLoyaltyTable(statistics.totals.leastEngaged, tbodyLeastEngaged);
    insertEngagedmentLoyaltyTable(statistics.totals.mostEngaged, tbodyMostEngaged);
} else if(loyaltyPage) {
    insertEngagedmentLoyaltyTable(statistics.totals.mostLoyals, tbodyMostLoyal);
    insertEngagedmentLoyaltyTable(statistics.totals.leastLoyals, tbodyLeastLoyal);
}

if(attendancePage || loyaltyPage) {
    insertTopTable(partiesArray)
}

function insertTopTable(array) {
    array.forEach(party => {
        const tr = document.createElement('tr');
    
        let tdParty = document.createElement('td');
        let tdNoReps = document.createElement('td');
        let tdPctVotesWParty = document.createElement('td');
    
        tdParty.textContent = party.name;
        tdNoReps.textContent = party.members;
        tdPctVotesWParty.textContent = party.avgVotes > 0 ? (party.avgVotes).toFixed(2) : '';

        tr.appendChild(tdParty);
        tr.appendChild(tdNoReps);
        tr.appendChild(tdPctVotesWParty);
        
        tbodyTopTable.appendChild(tr);
    });
}

function insertEngagedmentLoyaltyTable(array, table) {

    array.forEach(member => {

        const tr = document.createElement('tr');
        
        if(attendancePage) {
            let tdFullName = document.createElement('td');
            let tdNoMissedVotes = document.createElement('td');
            let tdPctMissedVotes = document.createElement('td');
            
            let middleName = member.middle_name || '';
    
            tdFullName.innerHTML = `<a href="${member.url}" target="_blank"> ${member.last_name}, ${member.first_name} ${middleName} </a>`;
            tdNoMissedVotes.textContent = member.missed_votes;
            tdPctMissedVotes.textContent = (member.missed_votes_pct).toFixed(2);
    
            tr.appendChild(tdFullName);
            tr.appendChild(tdNoMissedVotes);
            tr.appendChild(tdPctMissedVotes);
        }

        if(loyaltyPage) {
            let tdFullName = document.createElement('td');
            let tdNoPartyVotes = document.createElement('td');
            let tdPctPartyVotes = document.createElement('td');

            let middleName = member.middle_name || '';

            tdFullName.innerHTML = `<a href="${member.url}" target="_blank"> ${member.last_name}, ${member.first_name} ${middleName} </a>`;
            tdNoPartyVotes.textContent = Math.round((member.total_votes * member.votes_with_party_pct) / 100);
            tdPctPartyVotes.textContent = (member.votes_with_party_pct).toFixed(2);

            tr.appendChild(tdFullName);
            tr.appendChild(tdNoPartyVotes);
            tr.appendChild(tdPctPartyVotes);
        }

        table.appendChild(tr);
    });
}
/* RENDER TABLES */

/* TEST STATISTICS */
// console.log(statistics)