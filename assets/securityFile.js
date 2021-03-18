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
    democrats: {
        name: 'Democrats',
        members: 0,
        avgVotes: 0
    },
    republicans: {
        name: 'Republicans',
        members: 0,
        avgVotes: 0
    },
    independants: {
        name: 'Independant',
        members: 0,
        avgVotes: 0
    },
    totals: {
        leastLoyals: [],
        mostLoyals: [],
        mostEngaged: [],
        leastEngaged: []
    }
}

/* STATISTICS CALCULATIONS */
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
    let aux = [];
    let auxComp;
    data.forEach(member => {
        if(member.total_votes > 0) {
            aux.push(member);
        }
    })
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
/* STATISTICS FUNCTIONS */

/* RENDER TABLES */
function insertGeneralTable() {
    tbodyGeneral.innerHTML = '';
    //convierte en array todos los check que estan activos y luego recorro el mismo con un map para extraer cada value
    let checkboxGroup = Array.from(document.querySelectorAll('input[name=filterCheck]:checked')).map(el => el.value);
    let stateValue = select.value;
    data.forEach(member => {
        //primer parte de la condicion evalua si el miembro que esta recorriendo cumple con la condicion de alguno de los checkbox activos
        //Ej.: Jerry Milner - Party: ID, si esta checkeado ID lo va a mostrar, si no no

        //segunda parte de la condicion solo deja pasar a los que tengan el member.state selected en el html, o en su defecto a todos cuando stateValue sea State
        if (checkboxGroup.includes(member.party) && ((stateValue == member.state) || (stateValue == "All States"))) {

            const tr = document.createElement('tr');
            
            let tdFullName = document.createElement('td');
            let tdParty = document.createElement('td');
            let tdState = document.createElement('td');
            let tdSeniority = document.createElement('td');
            let tdVotesWithParty = document.createElement('td');
            
            tdFullName.innerHTML = `<a href="${member.url}" target="_blank"> ${member.first_name} ${member.last_name} </a>`;
            tdParty.textContent = `${member.party}`;
            tdState.textContent = `${member.state}`;
            tdSeniority.textContent = `${member.seniority}`;
            tdVotesWithParty.textContent = `${member.votes_with_party_pct || 0}`;
            
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
    insertTopTable()
}

function insertTopTable() {
    let partyNameA = document.querySelector('#partyNameA');
    let noRepsA = document.querySelector('#noRepsA');
    let pctVotedA = document.querySelector('#pctVotedA');

    let partyNameB = document.querySelector('#partyNameB');
    let noRepsB = document.querySelector('#noRepsB');
    let pctVotedB = document.querySelector('#pctVotedB');

    let partyNameC = document.querySelector('#partyNameC');
    let noRepsC = document.querySelector('#noRepsC');
    let pctVotedC = document.querySelector('#pctVotedC');

    let noRepsTotal = document.querySelector('#noRepsTotal');
    let pctVotedTotal = document.querySelector('#pctVotedTotal');

    partyNameA.innerHTML = statistics.democrats.name;
    noRepsA.innerHTML = statistics.democrats.members;
    pctVotedA.innerHTML = (statistics.democrats.avgVotes).toFixed(2);

    partyNameB.innerHTML = statistics.republicans.name;
    noRepsB.innerHTML = statistics.republicans.members;
    pctVotedB.innerHTML = (statistics.republicans.avgVotes).toFixed(2);

    partyNameC.innerHTML = statistics.independants.name;
    noRepsC.innerHTML = statistics.independants.members;
    pctVotedC.innerHTML = statistics.independants.avgVotes == 0 ? '' : (statistics.independants.avgVotes).toFixed(2);

    noRepsTotal.innerHTML = statistics.democrats.members + statistics.republicans.members + statistics.independants.members;
    pctVotedTotal.innerHTML = ''
}

function insertEngagedmentLoyaltyTable(array, table) {

    array.forEach(member => {

        const tr = document.createElement('tr');
        
        if(attendancePage) {
            let tdFullName = document.createElement('td');
            let tdNoMissedVotes = document.createElement('td');
            let tdPctMissedVotes = document.createElement('td');
    
            tdFullName.innerHTML = `<a href="${member.url}" target="_blank"> ${member.first_name} ${member.last_name} </a>`;
            tdNoMissedVotes.textContent = `${member.missed_votes}`;
            tdPctMissedVotes.textContent = `${member.missed_votes_pct}`;
    
            tr.appendChild(tdFullName);
            tr.appendChild(tdNoMissedVotes);
            tr.appendChild(tdPctMissedVotes);
        }

        if(loyaltyPage) {
            let tdFullName = document.createElement('td');
            let tdNoPartyVotes = document.createElement('td');
            let tdPctPartyVotes = document.createElement('td');

            tdFullName.innerHTML = `<a href="${member.url}" target="_blank"> ${member.first_name} ${member.last_name} </a>`;
            tdNoPartyVotes.textContent = `${member.total_votes}`;
            tdPctPartyVotes.textContent = `${member.votes_with_party_pct}`;

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